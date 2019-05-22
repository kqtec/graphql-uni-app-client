declare module '@kqtec/graphql-uni-app-client' {
    class client {
        constructor(arg: any)  //构造函数
        query(grl: string, param?: object): any
        mutate(grl: string, param?: object): any
        createFragment(grl: string): any
    }
    export default client;
}
