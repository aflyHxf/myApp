/**
 * 带收藏状态的item
 */
export default class ProjectModel {
    constructor(item, isFavorite) {
        this.item = item;
        this.isFavorite = isFavorite;
    }
}
