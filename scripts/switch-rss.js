#!/usr/bin/env node

/**
 * RSS源切换脚本
 * 用于快速切换RSS源配置
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 预定义的RSS源
const rssSources = {
  '1': {
    name: 'ZSXの小站 (Atom)',
    url: 'https://blog.zsxcoder.top/atom.xml',
    description: 'ZSX个人博客的Atom订阅源，包含15篇文章'
  },
  '2': {
    name: 'Sakura博客 (RSS)',
    url: 'https://blog.sakura.ink/rss.xml',
    description: 'Sakura博客的RSS订阅源，包含55篇文章'
  },
  '3': {
    name: 'ZSX备用博客 (RSS)',
    url: 'https://boke.zsx815.top/rss.xml',
    description: 'ZSX备用博客的RSS订阅源，包含14篇文章'
  },
  '4': {
    name: '自定义RSS/Atom源',
    url: null,
    description: '手动输入自定义的RSS或Atom源URL'
  }
}

/**
 * 更新.env文件中的RSS_URL
 */
function updateEnvRSSUrl(rssUrl) {
  const envPath = path.join(__dirname, '..', '.env')
  let envContent = ''
  
  // 读取现有的.env文件（如果存在）
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }
  
  // 查找并替换RSS_URL行，或者添加新行
  const rssUrlLine = `RSS_URL=${rssUrl}`
  const lines = envContent.split('\n')
  let rssUrlFound = false
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('RSS_URL=')) {
      lines[i] = rssUrlLine
      rssUrlFound = true
      break
    }
  }
  
  if (!rssUrlFound) {
    lines.push(rssUrlLine)
  }
  
  // 写回文件
  fs.writeFileSync(envPath, lines.join('\n'))
  console.log(`✅ 已将RSS_URL更新为: ${rssUrl}`)
}

/**
 * 主函数
 */
async function main() {
  console.log('RSS源切换工具\n')
  console.log('可用源:')
  
  Object.entries(rssSources).forEach(([key, source]) => {
    console.log(`  ${key}. ${source.name}`)
    console.log(`     URL: ${source.url || '（自定义）'}`)
    console.log(`     描述: ${source.description}\n`)
  })
  
  const { default: readline } = await import('readline')
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  
  const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve))
  
  const choice = await question('请选择RSS源 (1-4): ')
  
  if (rssSources[choice]) {
    let rssUrl = rssSources[choice].url
    
    if (!rssUrl) {
      rssUrl = await question('请输入自定义RSS/Atom源URL: ')
      if (!rssUrl) {
        console.log('❌ 未提供URL，操作已取消')
        rl.close()
        return
      }
    }
    
    updateEnvRSSUrl(rssUrl)
    
    const confirm = await question('是否立即测试新的RSS源? (y/n): ')
    if (confirm.toLowerCase() === 'y') {
      console.log('\n正在测试RSS源...')
      try {
        const { validateRSSURL } = await import('./validate-rss.js')
        const result = await validateRSSURL(rssUrl)
        
        if (result.valid) {
          console.log('✅ RSS源验证通过')
          console.log(`  - 频道标题: ${result.channel.title}`)
          console.log(`  - 文章数量: ${result.itemCount}`)
        } else {
          console.log('❌ RSS源验证失败')
          console.log('发现以下问题:')
          result.issues.forEach(issue => {
            console.log(`  - ${issue}`)
          })
        }
      } catch (error) {
        console.error(`❌ 测试失败: ${error.message}`)
      }
    }
    
    console.log('\n⚠️  注意: 如果项目正在运行，请重启以使配置生效')
  } else {
    console.log('❌ 无效选择')
  }
  
  rl.close()
}

// 运行主函数
main().catch(console.error)