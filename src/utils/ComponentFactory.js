import viewState from "@/mixins/viewState";

const baseComponent = {
    data(){
        return {
            _requests: new Map(), // 异步请求
            _delays: [], // 延迟函数 如果使用setTimeout
            _debounce: [], // 防抖函数
        }
    },
    destroyed() {
        // 自动取消异步请求
        if (this.$data._requests) {
            this.$data._requests.forEach(element => {
                element.cancel();
            });
        }
        // 自动clear通过this.$delay创建的延迟函数
        if (this.$data._delays) {
            this.$data._delays.forEach(t => {
                window.clearTimeout(t);
            });
        }
        // 自动clear未执行的debounce
        if (this.$data._debounce) {
            this.$data._debounce.forEach(d => {
                d.clear();
            });
        }
    }
}
export function ComponentFactory(component){
    component.mixins = [...(component.mixins || []), baseComponent, viewState];
}

export function ComponentFactories(components = []){
    return components.map(c => {
        return ComponentFactory(c);
    })
}