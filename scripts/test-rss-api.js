#!/usr/bin/env node

/**
 * RSS API测试脚本
 * 用于测试RSS API是否能正确处理Atom和RSS格式
 */

import { XMLParser } from 'fast-xml-parser'

/**
 * 测试RSS/Atom解析功能
 */
function testRSSParsing(content, format) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseTagValue: false,
    parseAttributeValue: false,
    trimValues: true,
    processEntities: true
  })

  try {
    const result = parser.parse(content)
    let items = []
    
    if (format === 'rss' && result.rss && result.rss.channel && result.rss.channel.item) {
      // RSS格式处理
      const rssItems = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item]
      
      items = rssItems.map((item) => {
        let description = item.description || item['content:encoded'] || '暂无描述'
        if (typeof description === 'string') {
          description = description
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/&nbsp;/g, ' ') // 替换空格实体
            .replace(/&amp;/g, '&')  // 替换&实体
            .replace(/&lt;/g, '<')   // 替换<实体
            .replace(/&gt;/g, '>')   // 替换>实体
            .trim()
            .substring(0, 200) // 限制长度
        }
        
        return {
          title: item.title || '无标题',
          link: item.link || '#',
          pubDate: item.pubDate || new Date().toISOString(),
          description,
          guid: item.guid?.['#text'] || item.guid || item.link
        }
      })
    } else if (format === 'atom' && result.feed && result.feed.entry) {
      // Atom格式处理
      const atomItems = Array.isArray(result.feed.entry) 
        ? result.feed.entry 
        : [result.feed.entry]
      
      items = atomItems.map((item) => {
        let description = item.summary || item.content || '暂无描述'
        if (typeof description === 'object' && description['#text']) {
          description = description['#text']
        }
        if (typeof description === 'string') {
          description = description
            .replace(/<[^>]*>/g, '') // 移除HTML标签
            .replace(/&nbsp;/g, ' ') // 替换空格实体
            .replace(/&amp;/g, '&')  // 替换&实体
            .replace(/&lt;/g, '<')   // 替换<实体
            .replace(/&gt;/g, '>')   // 替换>实体
            .trim()
            .substring(0, 200) // 限制长度
        }
        
        // 获取链接 - Atom格式中链接可能是一个对象
        let link = '#'
        if (item.link) {
          if (typeof item.link === 'string') {
            link = item.link
          } else if (item.link['@_href']) {
            link = item.link['@_href']
          }
        }
        
        // 获取发布日期 - Atom格式中可能是updated或published
        const pubDate = item.published || item.updated || new Date().toISOString()
        
        return {
          title: item.title || '无标题',
          link,
          pubDate,
          description,
          guid: item.id || link
        }
      })
    }
    
    // 按日期排序，最新的在前
    items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    
    return {
      success: true,
      itemCount: items.length,
      items: items.slice(0, 3) // 只返回前3篇文章用于测试
    }
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 测试实际的RSS源
 */
async function testLiveRSSSource(url, format) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Test Script)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const content = await response.text()
    const result = testRSSParsing(content, format)
    
    console.log(`\n测试源: ${url}`)
    console.log(`格式: ${format.toUpperCase()}`)
    
    if (result.success) {
      console.log(`✅ 解析成功 - 文章数量: ${result.itemCount}`)
      console.log("\n前3篇文章:")
      result.items.forEach((item, index) => {
        console.log(`\n文章 ${index + 1}:`)
        console.log(`  标题: ${item.title}`)
        console.log(`  链接: ${item.link}`)
        console.log(`  日期: ${item.pubDate}`)
        console.log(`  描述: ${item.description.substring(0, 100)}...`)
      })
    } else {
      console.log(`❌ 解析失败: ${result.error}`)
    }
    
    return result
    
  } catch (error) {
    console.log(`❌ 请求失败: ${error.message}`)
    return { success: false, error: error.message }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('RSS API 功能测试\n')
  console.log('正在测试RSS/Atom解析功能...\n')
  
  // 测试Atom源
  await testLiveRSSSource('https://blog.zsxcoder.top/atom.xml', 'atom')
  
  // 测试RSS源
  await testLiveRSSSource('https://blog.sakura.ink/rss.xml', 'rss')
  
  console.log('\n测试完成')
}

export { testRSSParsing, testLiveRSSSource, main }