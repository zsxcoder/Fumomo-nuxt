#!/usr/bin/env node

/**
 * RSS验证器脚本
 * 用于验证RSS源的格式和内容
 */

import fs from 'fs'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'

/**
 * 验证RSS内容格式
 */
function validateRSSContent(content, url) {
  
  try {
    const parser = new XMLParser()
    const result = parser.parse(content)
    
    const issues = []
    
    let itemCount = 0
    let channelInfo = { title: '', link: '', description: '' }
    
    // 检查基本结构 - 支持RSS和Atom
    if (result.rss) {
      // RSS格式
      if (!result.rss.channel) {
        issues.push('缺少channel元素')
        return { valid: false, issues }
      }
      
      const channel = result.rss.channel
      
      // 检查必需的频道元素
      const requiredChannelElements = ['title', 'link', 'description']
      requiredChannelElements.forEach(elem => {
        if (!channel[elem]) {
          issues.push(`channel缺少必需元素: ${elem}`)
        }
      })
      
      // 检查文章数据
      if (channel.item) {
        const items = Array.isArray(channel.item) ? channel.item : [channel.item]
        itemCount = items.length
        
        if (items.length === 0) {
          issues.push('没有找到任何文章')
        } else {
          // 检查每篇文章的必需元素
          items.forEach((item, index) => {
            if (!item.title) {
              issues.push(`文章 ${index + 1} 缺少标题`)
            }
            if (!item.link && !item.guid) {
              issues.push(`文章 ${index + 1} 缺少链接或GUID`)
            }
            if (!item.pubDate) {
              issues.push(`文章 ${index + 1} 缺少发布日期`)
            }
          })
        }
      } else {
        issues.push('channel中没有找到任何item元素')
      }
      
      channelInfo = {
        title: channel.title,
        link: channel.link,
        description: channel.description ? channel.description.substring(0, 100) + '...' : ''
      }
      
    } else if (result.feed) {
      // Atom格式
      const feed = result.feed
      
      // 检查必需的频道元素
      if (!feed.title) {
        issues.push('feed缺少必需元素: title')
      }
      
      // 检查文章数据
      if (feed.entry) {
        const items = Array.isArray(feed.entry) ? feed.entry : [feed.entry]
        itemCount = items.length
        
        if (items.length === 0) {
          issues.push('没有找到任何文章')
        } else {
          // 检查每篇文章的必需元素
          items.forEach((item, index) => {
            if (!item.title) {
              issues.push(`文章 ${index + 1} 缺少标题`)
            }
            
            // Atom格式的链接处理
            let hasLink = false
            if (item.link) {
              if (typeof item.link === 'string' && item.link) {
                hasLink = true
              } else if (item.link['@_href'] && item.link['@_href']) {
                hasLink = true
              }
            }
            
            if (!hasLink && !item.id) {
              issues.push(`文章 ${index + 1} 缺少链接或ID`)
            }
            
            if (!item.published && !item.updated) {
              issues.push(`文章 ${index + 1} 缺少发布日期或更新日期`)
            }
          })
        }
      } else {
        issues.push('feed中没有找到任何entry元素')
      }
      
      // 获取频道链接（Atom格式中可能有多个链接）
      let feedLink = ''
      if (feed.link) {
        if (typeof feed.link === 'string') {
          feedLink = feed.link
        } else if (Array.isArray(feed.link)) {
          // 尝试找到类型为 alternate 或 self 的链接
          const altLink = feed.link.find(l => l['@_type'] === 'alternate' || l['@_rel'] === 'alternate')
          if (altLink && altLink['@_href']) {
            feedLink = altLink['@_href']
          } else if (feed.link[0] && feed.link[0]['@_href']) {
            feedLink = feed.link[0]['@_href']
          }
        } else if (feed.link['@_href']) {
          feedLink = feed.link['@_href']
        }
      }
      
      channelInfo = {
        title: feed.title,
        link: feedLink,
        description: feed.subtitle ? (typeof feed.subtitle === 'string' ? feed.subtitle.substring(0, 100) + '...' : '') : ''
      }
      
    } else {
      issues.push('无法识别的订阅源格式（既不是RSS也不是Atom）')
    }
    
    return {
      valid: issues.length === 0,
      issues,
      itemCount,
      channel: channelInfo
    }
    
  } catch (error) {
    return {
      valid: false,
      issues: [`XML解析错误: ${error.message}`]
    }
  }
}

/**
 * 从文件验证RSS
 */
function validateRSSFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`文件不存在: ${filePath}`)
    }
    
    const content = fs.readFileSync(filePath, 'utf8')
    return validateRSSContent(content, `file://${filePath}`)
  } catch (error) {
    return {
      valid: false,
      issues: [`文件读取错误: ${error.message}`]
    }
  }
}

/**
 * 从URL验证RSS
 */
async function validateRSSURL(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Validator Script)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000) // 15秒超时
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const content = await response.text()
    return {
      ...validateRSSContent(content, url),
      url,
      status: response.status
    }
    
  } catch (error) {
    return {
      valid: false,
      issues: [`请求错误: ${error.message}`],
      url
    }
  }
}

/**
 * 检查环境配置
 */
function checkEnvironmentConfig() {
  const envPath = path.join(process.cwd(), '.env')
  const envExamplePath = path.join(process.cwd(), '.env.example')
  
  let rssUrl = null
  let configSource = null
  
  // 尝试从 .env 文件读取
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const match = envContent.match(/^RSS_URL=(.+)$/m)
    if (match) {
      rssUrl = match[1].trim()
      configSource = '.env 文件'
    }
  }
  
  // 如果 .env 中没有，尝试从 .env.example 读取
  if (!rssUrl && fs.existsSync(envExamplePath)) {
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8')
    const match = envExampleContent.match(/^RSS_URL=(.+)$/m)
    if (match) {
      rssUrl = match[1].trim()
      configSource = '.env.example 文件'
    }
  }
  
  // 如果还是没有，从 nuxt.config.ts 读取默认值
  if (!rssUrl) {
    try {
      const nuxtConfigPath = path.join(process.cwd(), 'nuxt.config.ts')
      const nuxtConfigContent = fs.readFileSync(nuxtConfigPath, 'utf8')
      const match = nuxtConfigContent.match(/rssUrl:\s*['"]([^'"]+)['"]/)
      if (match) {
        rssUrl = match[1]
        configSource = 'nuxt.config.ts 默认值'
      }
    } catch (error) {
      // 忽略读取错误
    }
  }
  
  return { rssUrl, configSource }
}

/**
 * 主函数
 */
async function main() {
  console.log('RSS 配置验证器\n')
  
  // 检查环境配置
  const { rssUrl, configSource } = checkEnvironmentConfig()
  
  if (!rssUrl) {
    console.error('❌ 未找到 RSS_URL 配置')
    console.log('请在以下文件之一中配置 RSS_URL:')
    console.log('  1. .env 文件')
    console.log('  2. .env.example 文件')
    console.log('  3. nuxt.config.ts 文件')
    process.exit(1)
  }
  
  console.log(`RSS URL: ${rssUrl}`)
  console.log(`配置来源: ${configSource}\n`)
  
  // 验证RSS
  console.log('正在验证RSS源...')
  const validation = await validateRSSURL(rssUrl)
  
  if (validation.valid) {
    console.log('✅ RSS 验证通过')
    console.log(`  - 频道标题: ${validation.channel.title}`)
    console.log(`  - 频道链接: ${validation.channel.link}`)
    console.log(`  - 文章数量: ${validation.itemCount}`)
    console.log(`  - 状态码: ${validation.status}`)
  } else {
    console.log('❌ RSS 验证失败')
    console.log('发现以下问题:')
    validation.issues.forEach(issue => {
      console.log(`  - ${issue}`)
    })
    
    console.log('\n建议:')
    console.log('  1. 检查RSS URL是否正确')
    console.log('  2. 确认RSS源是否可访问')
    console.log('  3. 验证RSS格式是否符合标准')
  }
}

export { validateRSSContent, validateRSSFile, validateRSSURL, checkEnvironmentConfig, main }