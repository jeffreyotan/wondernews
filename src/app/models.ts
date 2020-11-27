export interface ApikeyStore {
    apikey: string
}

export interface CountryDetails {
    code: string,
    name: string,
    flagUrl: string
}

export interface NewsArticle {
    sourceName: string,
    author: string,
    title: string,
    description: string,
    articleUrl: string,
    imageUrl: string,
    pubTime: string,
    content: string
}