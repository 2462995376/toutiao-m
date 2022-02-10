import request from '@/utils/request'

// 获取联想建议
// Path： /app/v1_0/suggestion
// Method： GET
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

// 获取搜索结果
// Path： /app/v1_0/search
// Method： GET

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
