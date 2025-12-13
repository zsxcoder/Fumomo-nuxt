import { XMLParser } from 'fast-xml-parser'

export interface RSSItem {
  title: string
  link: string
  pubDate: string
  description: string
  guid?: string
}

export interface RSSResponse {
  items: RSSItem[]
  total: number
  error?: string
}

export default defineEventHandler(async (event): Promise<RSSResponse> => {
  try {
    // 从环境变量中获取 RSS URL
    const config = useRuntimeConfig()
    const rssUrl = config.rssUrl
    
    if (!rssUrl) {
      console.error('RSS URL 未配置')
      return {
        items: [],
        total: 0,
        error: 'RSS URL 未配置，请在 .env 文件中设置 RSS_URL 或在 nuxt.config.ts 中配置默认值'
      }
    }
    
    console.log('正在获取 RSS:', rssUrl)
    
    // 尝试获取 RSS 数据，包含多个备选方案
    let response: string | null = null
    let lastError: Error | null = null
    
    // 尝试主要URL
    try {
      response = await fetchRSS(rssUrl)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn('主要RSS源获取失败，尝试备选方案:', lastError.message)
      
      // 备选方案1：尝试使用HTTP而非HTTPS（如果原URL是HTTPS）
      if (rssUrl.startsWith('https://')) {
        try {
          const httpUrl = rssUrl.replace('https://', 'http://')
          console.log('尝试HTTP连接:', httpUrl)
          response = await fetchRSS(httpUrl)
        } catch (httpError) {
          console.warn('HTTP连接也失败')
        }
      }
      
      // 备选方案2：尝试使用代理服务（如果可用）
      if (!response && process.env.NODE_ENV === 'development') {
        try {
          // 在开发环境下尝试使用CORS代理
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`
          console.log('尝试代理服务:', proxyUrl)
          response = await fetchRSS(proxyUrl)
        } catch (proxyError) {
          console.warn('代理服务也失败')
        }
      }
    }
    
    // 如果所有尝试都失败，抛出最后的错误
    if (!response) {
      throw lastError || new Error('无法获取RSS数据')
    }
    
    // 解析 XML
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      parseTagValue: false,
      parseAttributeValue: false,
      trimValues: true,
      processEntities: true
    })

    const result = parser.parse(response)
    
    // 提取文章数据
    let items: RSSItem[] = []
    
    // 支持RSS和Atom两种格式
    if (result.rss && result.rss.channel && result.rss.channel.item) {
      // RSS格式处理
      const rssItems = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item]
      
      items = rssItems.map((item: any) => {
        // 清理描述内容，移除HTML标签
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
    } else if (result.feed && result.feed.entry) {
      // Atom格式处理
      const atomItems = Array.isArray(result.feed.entry) 
        ? result.feed.entry 
        : [result.feed.entry]
      
      items = atomItems.map((item: any) => {
        // 清理描述内容，移除HTML标签
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

    console.log(`RSS 获取成功，共 ${items.length} 篇文章`)

    return {
      items,
      total: items.length
    }

  } catch (error) {
    console.error('RSS 获取失败:', error)
    
    // 提供更详细的错误信息
    let errorMessage = 'RSS 获取失败'
    
    if (error instanceof Error) {
      if (error.message.includes('fetch failed')) {
        errorMessage = 'RSS 源无法访问，请检查网络连接或 RSS URL 是否正确'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'RSS 获取超时，可能是网络延迟或服务器响应缓慢。建议稍后重试或更换RSS源'
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = '无法解析RSS源域名，请检查URL是否正确'
      } else {
        errorMessage = `RSS 获取失败: ${error.message}`
      }
    }
    
    return {
      items: [],
      total: 0,
      error: errorMessage
    }
  }
})

// 提取RSS获取逻辑为单独函数，便于重试
async function fetchRSS(url: string): Promise<string> {
  // 获取 RSS 数据，设置超时和重试
  return await $fetch<string>(url, {
    timeout: 30000, // 增加到30秒超时，应对网络延迟
    retry: 3, // 增加重试次数到3次
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Nuxt RSS Reader; +https://haku.sakura.ink)',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      'Cache-Control': 'no-cache', // 避免缓存问题
      'Connection': 'keep-alive' // 保持连接
    },
    // 添加更详细的请求配置
    onRequestError({ request, error }) {
      console.error('RSS 请求失败:', request, error)
    },
    onResponseError({ request, response }) {
      console.error('RSS 响应错误:', request, response.status)
    }
  })
}