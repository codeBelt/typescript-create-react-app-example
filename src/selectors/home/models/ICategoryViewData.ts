import ICategoryListItem from './ICategoryListItem';
import CategoryEnum from '../../../constants/CategoryEnum';

export default interface ICategoryViewData {
    readonly displayCount: string;
    readonly loadMoreUrl: string;
    readonly category: CategoryEnum;
    readonly items: ICategoryListItem[];
}