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

        // ✅ Use /search instead of /top-headlines
        const url = `https://gnews.io/api/v4/search?q=${this.props.category}&lang=en&country=${this.props.country}&max=${this.props.pageSize}&apikey=${this.props.apiKey}`;
        console.log("fetching URL:", url);

        this.setState({ loading: true });

        try {
            const data = await fetch(url);
            if (!data.ok) {
                console.error("network response was not ok", data.statusText);
                this.setState({ loading: false });
                return;
            }

            this.props.setProgress(30);
            const parsedData = await data.json();
            console.log("parsed data:", parsedData);

            this.props.setProgress(70);

            this.setState({
                articles: parsedData.articles || [],
                totalResults: parsedData.articles ? parsedData.articles.length : 0, // GNews free plan does not give totalResults
                loading: false,
                hasMore: parsedData.articles && parsedData.articles.length >= this.props.pageSize,
            });

            this.props.setProgress(100);
        } catch (error) {
            console.error('Error fetching news:', error);
            this.setState({ loading: false });
            this.props.setProgress(100);
        }
    }

    componentDidMount() {
        console.log("API Key:", this.props.apiKey);
        this.updateNews();
    }

    fetchMoreData = async () => {
        const nextPage = this.state.page + 1;

        const url = `https://gnews.io/api/v4/search?q=${this.props.category}&lang=en&country=${this.props.country}&max=${this.props.pageSize}&apikey=${this.props.apiKey}`;

        try {
            const data = await fetch(url);
            const parsedData = await data.json();

            if (!parsedData.articles || parsedData.articles.length === 0) {
                console.warn("No more articles returned by the API.");
                this.setState({ hasMore: false });
                return;
            }

            this.setState((prevState) => {
                const updatedArticles = prevState.articles.concat(parsedData.articles);
                return {
                    articles: updatedArticles,
                    totalResults: updatedArticles.length,
                    page: nextPage,
                    hasMore: parsedData.articles.length >= this.props.pageSize
                };
            });
        } catch (error) {
            console.error('Error in fetchMoreData:', error);
            this.setState({ hasMore: false });
        }
    };

    render() {
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px' }}>
                    NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
                </h1>
                {this.state.loading && <Spinner />}

                {!this.state.loading && (
                    <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchMoreData}
                        hasMore={this.state.hasMore}
                        loader={<Spinner />}
                    >
                        <div className="container">
                            <div className="row">
                                {this.state.articles.map((element, index) => {
                                    return (
                                        <div className="col-md-4" key={index}>
                                            <NewsItem
                                                title={element.title || ""}
                                                description={element.description || ""}
                                                imageUrl={element.image}
                                                newsUrl={element.url}
                                                author={element.source?.name || "Unknown"}
                                                date={element.publishedAt}
                                                source={element.source?.name || ""}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </InfiniteScroll>
                )}
            </>
        )
    }
}

export default News
