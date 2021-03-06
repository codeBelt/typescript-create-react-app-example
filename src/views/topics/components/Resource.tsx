import styles from './Resource.module.scss';

import React from 'react';
import {RouteComponentProps} from 'react-router-dom';
import {ITopicRoutePramas} from './Topic';
import ITopic from '../../../stores/content/models/ITopic';
import IResource from '../../../stores/content/models/IResource';
import MetaAction from '../../../stores/meta/MetaAction';
import IAction from '../../../stores/IAction';
import IStore from '../../../stores/IStore';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ITopicsRoutePramas} from '../Topics';

interface IProps {}
interface IState {}
interface IStateToProps {
    readonly topics: ITopic[];
}
interface IDispatchToProps {
    dispatch: (action: IAction<any>) => void;
}

const mapStateToProps = (state: IStore) => ({
    topics: state.contentReducer.topics,
});
const mapDispatchToProps = (dispatch: Dispatch<IAction<any>>): IDispatchToProps => ({
    dispatch,
});

class Resource extends React.Component<IStateToProps & IDispatchToProps & IProps & RouteComponentProps<ITopicsRoutePramas & ITopicRoutePramas>, IState> {

    public componentDidMount(): void {
        this.props.dispatch(MetaAction.setMeta({title: 'Resource View'}));
    }

    public render(): JSX.Element {
        const {topics, match} = this.props;
        const topic: ITopic | undefined = topics.find((model: ITopic) => model.id === match.params.topicId);
        let resource: IResource | undefined | null = null;

        if (topic) {
            resource = topic.resources.find((model: IResource) => model.id === match.params.subId);
        }

        return (
            <>
                {resource && (
                    <div className={styles.wrapper}>
                        <h3>{resource.name}</h3>
                        <p>{resource.description}</p>
                        <a href={resource.url}>More info.</a>
                    </div>
                )}
                {!resource && (
                    <span>Content not found</span>
                )}
            </>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Resource);
