import React, { Component } from 'react'

export class NewsItem extends Component {
  render(){
  
    let {title ,imageUrl,newsUrl,author,date,source} = this.props;
    return (
      <div className="my-3">
        <div className="card" >
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            position:'absolute',
            right: '0'
          }}>      
           <span class=" badge rounded-pill bg-danger" > {source}</span>
           </div>
          <img src={!imageUrl?"https://media.cnn.com/api/v1/images/stellar/prod/atc-simulator2.jpg?c=16x9&q=w_800,c_fill": imageUrl} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{title} 
             
            </h5>
            
            <p className="card-text"><small className="text-muted">by {!author?"Unknown": author} on {new Date(date).toGMTString()}</small></p>
            <a rel="noreferrer" href={newsUrl} className="btn btn-sm btn-dark">
              Read More
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NewsItem
