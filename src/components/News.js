import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    static defaultProps = {
        country: 'us',
        pageSize: 8,
        category: 'general',
    };

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
         apiKey: PropTypes.string.isRequired,
    setProgress: PropTypes.func.isRequired,
    }
     capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 
    // capitalizeFirstLetter = (string) => {
// const News = (props)=>{
//     const [articles, setArticles] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [page, setPage] = useState(1)
//     const [totalResults, setTotalResults] = useState(0)
//     // document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    
    
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: true,
            page: 1,
            totalResults: 0,
            hasMore: true

        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - News-Awake`;
    
  }

    async updateNews() {
        this.props.setProgress(10);
        
      const url = `https://gnews.io/api/v4/top-headlines?category=${this.props.category}&lang=en&country=us&max=${this.props.pageSize}&apikey=${this.props.apiKey}`;
        console.log("fetching URL:",url);
        this.setState({ loading: true });

    // const updateNews = async ()=> {
    //     props.setProgress(10);
    //     const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`; 
    //     setLoading(true)
    try{
        const data = await fetch(url);
        if(!data.ok) {
          console.error("network response was not ok",data.statusText);
           this.setState({loading:false });
           return;
        }
        this.props.setProgress(30);
        const parsedData = await data.json()
        console.log("parsed data:", parsedData);

        this.props.setProgress(70);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false, 
             hasMore: parsedData.articles.length < parsedData.totalResults,
        })
        this.props.setProgress(100);
          } catch (error) {
      console.error('Error fetching news:', error);
      this.setState({ loading: false });
      this.props.setProgress(100);
      

        // props.setProgress(70);
        // setArticles(parsedData.articles)
        // setTotalResults(parsedData.totalResults)
        // setLoading(false)
        // props.setProgress(100);

    }
}
     componentDidMount() {
      console.log("API Key:", this.props.apiKey);
        this.updateNews();
    }

    handlePrevClick = async () => {
        this.setState(
            (prevState) =>({ page: prevState.page - 1 }),
        this.updateNews
    );
    // useEffect(() => {
    //     updateNews(); 
    // }, [])
};

    //  handlePrevClick = async () => {
    //     this.setState({page: this.state.page -1});
    //     this.updateNews();
    // }

    handleNextClick = async () => {
        this.setState(
            (prevState) => ({ page: prevState.page + 1 }),
        this.updateNews
     );
    // const handleNextClick = async () => { 
    //     setPage(page+1)
    //     updateNews()
    }  ;

    fetchMoreData = async () => {  
      const nextPage = this.state.page + 1;
    
const url = `https://gnews.io/api/v4/top-headlines?category=${this.props.category}&lang=en&country=us&max=${this.props.pageSize}&apikey=${this.props.apiKey}`;
    // const fetchMoreData = async () => {   
    //     setPage(page+1) 
    //     const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    try{
        const data = await fetch(url);
        const parsedData = await data.json();
           if (!parsedData.articles || parsedData.articles.length === 0) {
            console.warn("No more articles returned by the API.");
      this.setState({ hasMore: false });
      return;
    }
        this.setState((prevState) =>{
            const updatedArticles = prevState.articles.concat(parsedData.articles);
            return {
            articles: updatedArticles,
            // articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults,
            page: nextPage,
             hasMore: updatedArticles.length < (parsedData.totalResults || 0)
        }
        // setArticles(articles.concat(parsedData.articles))
        // setTotalResults(parsedData.totalResults)
      });
    } catch (error) {
      console.error('Error in fetchMoreData:', error);
      this.setState({ hasMore: false });
    }
  };

    render() { 
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
                {this.state.loading && <Spinner />}
                {/* <h1 className="text-center" style={{ margin: '35px 0px' }}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />} */}
                {!this.state.loading && (
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.hasMore}
                    // hasMore={this.state.articles.length !== this.state.totalResults}
                    // dataLength={articles.length}
                    loader={<Spinner/>}
                > 
                    <div className="container">

                    <div className="row">
                        {this.state.articles.map((element) => 
                      {
                            return (<div className="col-md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} 
                                description={element.description ? element.description : ""}
                                 imageUrl={element.urlToImage} newsUrl={element.url} 
                                 author={element.author} date={element.publishedAt}
                                  source={element.source.name} />
                            </div> );
    })}
                        </div>
                        </div>
                        </InfiniteScroll>)}
</>
                      )
                    }
                  
                  }  
export default News
