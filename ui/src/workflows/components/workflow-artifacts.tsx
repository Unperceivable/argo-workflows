import * as React from 'react';

import {Timestamp} from '../../shared/components/timestamp';
import * as models from '../../shared/models';
import {services} from '../../shared/services';
import {TIMESTAMP_KEYS} from '../../shared/use-timestamp';

interface Props {
    workflow: models.Workflow;
    archived: boolean;
}

export function WorkflowArtifacts(props: Props) {
    const workflowStatusNodes = (props.workflow.status && props.workflow.status.nodes) || {};
    const artifacts =
        Object.keys(workflowStatusNodes)
            .map(nodeName => {
                const node = workflowStatusNodes[nodeName];
                const nodeOutputs = node.outputs || {artifacts: [] as models.Artifact[]};
                const items = nodeOutputs.artifacts || [];
                return items.map(item =>
                    Object.assign({}, item, {
                        downloadUrl: services.workflows.getArtifactDownloadUrl(props.workflow, node.id, item.name, props.archived, false),
                        stepName: node.name,
                        dateCreated: node.finishedAt,
                        nodeName
                    })
                );
            })
            .reduce((first, second) => first.concat(second), []) || [];
    if (artifacts.length === 0) {
        return (
            <div className='white-box'>
                <div className='row'>
                    <div className='columns small-12 text-center'>No data to display</div>
                </div>
            </div>
        );
    }
    return (
        <div className='white-box'>
            <div className='white-box__details'>
                <div className='row header'>
                    <div className='columns download'>Download</div>
                    <div className='columns artifact-name'>Artifact Name</div>
                    <div className='columns step-name'>Step Name</div>
                    <div className='columns path'>Path</div>
                    <div className='columns created-at'>Created at</div>
                </div>

                {artifacts.map(artifact => (
                    <div className='row artifact-row' key={artifact.name}>
                        <div className='columns download'>
                            <a href={artifact.downloadUrl}>
                                <i className='fa fa-download' />
                            </a>
                        </div>
                        <div className='columns artifact-name'>
                            <span className='hoverable'>{artifact.name}</span>
                        </div>
                        <div className='columns step-name'>
                            <span className='hoverable'>{artifact.stepName}</span>
                        </div>
                        <div className='columns path'>
                            <span className='hoverable'>{artifact.path}</span>
                        </div>
                        <div className='columns created-at'>
                            <span className='hoverable'>
                                <Timestamp date={artifact.dateCreated} timestampKey={TIMESTAMP_KEYS.WORKFLOW_NODE_ARTIFACT_CREATED} />
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
