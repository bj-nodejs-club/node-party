import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IEmail {
    title:string;
    body:string;
    details:IEmailDetails;
}

export interface IEmailDetails {
    from:string;
    to:string;
    date5:string;
}

const DetailsComp = (details:IEmailDetails)=>{
    return <div className="email-details" style={{ fontSize:'small', opacity: 0.7 }}>
        <ul>
            <li>From: { details.from }</li>
            <li>To:   { details.to }</li>
            <li>Data: { details.date5 }</li>
        </ul>
    </div>
};



export class EmailItemComponent extends React.Component<IEmail,IEmail>{
    render(){
        return <div className="email-item" style={{ height:67}}>
            <h1>{ this.props.title }</h1>
            <DetailsComp  { ...this.props.details } />
            <div className="email-body">
                {this.props.body}
            </div>
        </div>
    }
}