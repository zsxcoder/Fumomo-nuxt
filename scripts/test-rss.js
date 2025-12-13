#!/usr/bin/env node

/**
 * RSS源测试脚本
 * 用于测试RSS源的可用性和响应速度
 */

import { XMLParser } from 'fast-xml-parser'

// 测试RSS源列表
const rssSources = [
  'https://blog.mcyzsx.top/atom.xml',
  'https://blog.sakura.ink/rss.xml',
  'https://boke.zsx815.top/rss.xml',
]

/**
 * 测试单个RSS源
 */
async function testRSSSource(url) {
  console.log(`测试RSS源: ${url}`)
  
  try {
    const startTime = Date.now()
    
    // 使用fetch获取RSS内容
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Test Script)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000) // 15秒超时
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const text = await response.text()
    const fetchTime = Date.now() - startTime
    
    // 尝试解析XML
    const parser = new XMLParser()
    const result = parser.parse(text)
    
    // 检查是否包含RSS/Atom数据
    let itemCount = 0
    if (result.rss?.channel?.item) {
      itemCount = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item.length 
        : 1
    } else if (result.feed?.entry) {
      itemCount = Array.isArray(result.feed.entry) 
        ? result.feed.entry.length 
        : 1
    }
    
    console.log(`✅ 成功 - 响应时间: ${fetchTime}ms, 文章数量: ${itemCount}`)
    return { success: true, url, fetchTime, itemCount }
    
  } catch (error) {
    console.error(`❌ 失败: ${error.message}`)
    return { success: false, url, error: error.message }
  }
}

/**
 * 测试所有RSS源
 */
async function testAllRSSSources() {
  console.log('开始测试RSS源...\n')
  
  const results = []
  
  for (const url of rssSources) {
    const result = await testRSSSource(url)
    results.push(result)
    console.log('---')
  }
  
  // 按响应时间排序成功的源
  const successful = results.filter(r => r.success).sort((a, b) => a.fetchTime - b.fetchTime)
  const failed = results.filter(r => !r.success)
  
  console.log('\n测试结果汇总:')
  console.log(`成功: ${successful.length}/${rssSources.length}`)
  
  if (successful.length > 0) {
    console.log('\n响应最快的RSS源:')
    successful.forEach(r => {
      console.log(`  ${r.url} - ${r.fetchTime}ms (${r.itemCount} 篇文章)`)
    })
    
    console.log('\n建议配置:')
    console.log(`RSS_URL=${successful[0].url}`)
  }
  
  if (failed.length > 0) {
    console.log('\n失败的RSS源:')
    failed.forEach(r => {
      console.log(`  ${r.url} - ${r.error}`)
    })
  }
  
  return results
}

// 如果直接运行此脚本
if (process.argv[1] === __filename.replace(/\\/g, '/')) {
  testAllRSSSources().catch(console.error)
}

export { testRSSSource, testAllRSSSources }