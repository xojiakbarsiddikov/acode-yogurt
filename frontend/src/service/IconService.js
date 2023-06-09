export class IconService {
    constructor () {
        this.icons = [];
        this.selectedIcon = null;
        this.contextPath = import.meta.env.BASE_URL;
    }

    getIcons () {
        return fetch(this.contextPath + 'demo/data/icons.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.icons);
    }

    getIcon (id) {
        if (this.icons) {
            this.selectedIcon = this.icons.find(x => x.properties.id === id);
            return this.selectedIcon;
        }
    }
}
