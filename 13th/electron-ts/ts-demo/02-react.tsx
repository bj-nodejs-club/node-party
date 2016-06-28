import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IEmail, EmailItemComponent } from './02-email';



/**   aaaa */
class MailboxComponent extends React.Component<{ emails:IEmail[] },{}> {
    render(){
        return <div>
            {
                this.props.emails.forEach(mail=>
                    <EmailItemComponent {...mail} />
                )
            }
        </div>
    }
}



var emails:IEmail[] = [
    {
        title:'Hi there',
        body:`Hello, I'm zc. How are you going?`,
        details:{
            from:'zc@me.com',
            to:'root@moon.com',
            date5:'2046-12-34 12:00'
        }
    }
];

ReactDOM.render(<MailboxComponent emails={emails}/>,document.getElementById('inbox'))