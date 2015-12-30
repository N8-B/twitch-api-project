import React, { Component } from 'react';
import ToolboxApp from 'react-toolbox/lib/app';
import request from 'superagent';
import superagentAsPromised from 'superagent-as-promised';
const fetch = superagentAsPromised(request);

// Components
import Button from 'react-toolbox/lib/button';
import Header from './components/Header/header';
import Test from './components/Test/test';
import Spinner from './components/Spinner/spinner';
import { List, ListItem, ListSubHeader } from 'react-toolbox/lib/list';
import Input from 'react-toolbox/lib/input';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';

// Grid Styling
const {Grid, Row, Col} = require('react-flexbox-grid');

// Styles and Images
import style from './style';
import userPlaceholderImage from './components/userPlaceholderImage.png'

// Variables
const baseStreamsUrl = 'https://api.twitch.tv/kraken/streams/';
const baseUsersUrl = 'https://api.twitch.tv/kraken/users/';
const baseTopVideosUrl = 'https://api.twitch.tv/kraken/videos/top'
const defaultUsers = [ "freecodecamp", "storbeck", "terakilobyte", "habathcx", "RobotCaleb", "thomasballinger", "noobs2ninjas", "beohoff", "streamerhouse", "brunofin", "comster404"];

export class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      userNames: defaultUsers,
      users: [],
      twitchTopTen: [],
      loading: false,
      filter: 'all',
      query: '',
      filteredUsers: undefined,
      tabIndex: 0
    }
    this.fetchUserData = this.fetchUserData.bind(this);
    this.fetchStreamData = this.fetchStreamData.bind(this);
    this.fetchTopVideosData = this.fetchTopVideosData.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSearchInputBlur = this.handleSearchInputBlur.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleAllTabClick = this.handleAllTabClick.bind(this);
    this.handleOnlineTabClick = this.handleOnlineTabClick.bind(this);
    this.handleOfflineTabClick = this.handleOfflineTabClick.bind(this);
  }
  fetchUserData(user) {
    request.get(baseUsersUrl + user)
      .end((error, response) => {
        if (response.statusCode === 422 || error) {
          console.log('FetchUserData error: ', error);
          const get = response.body;
          const name = user;
          const message = get.message;
          const logo = (get.logo) ? get.logo : userPlaceholderImage;
          this.setState({
            users: this.state.users.concat({
              name,
              logo,
              online: false,
              streamTitle: message
            })
          });
        } else if (response.statusText === "OK") {
          const get = response.body
          const name = get.name;
          const logo = (get.logo) ? get.logo : userPlaceholderImage;
          const url = 'http://www.twitch.tv/' + name;
          this.setState({
            users: this.state.users.concat({
              url,
              name,
              logo,
              online: false,
              streamTitle: 'Offline'
            }),
            loading: false
          });
        }
      })
  }
  fetchStreamData(user) {
    request.get(baseStreamsUrl + user)
      .end((error, response) => {
        console.log(response);
        if (response.statusCode === 422 || error) {
          console.log('FetchStreamData error: ', error);
          const get = response.body;
          const name = user;
          const message = get.message;
          const logo = (get.logo) ? get.logo : userPlaceholderImage;
          this.setState({
            users: this.state.users.concat({
              name,
              logo,
              online: false,
              streamTitle: message
            })
          });
        } else if (response.body.stream !== null) {
          const get = response.body.stream.channel;
          const name = get.name;
          const logo = (get.logo) ? get.logo : userPlaceholderImage;
          const streamTitle = get.status
          const url = 'http://www.twitch.tv/' + name;
          this.setState({
            users: this.state.users.concat({
              url,
              name,
              logo,
              online: true,
              streamTitle
            }),
            loading: false
          });
        } else {
          this.fetchUserData(user);
        }
      })
  }
  fetchTopVideosData() {
    fetch(baseTopVideosUrl)
      .then((response) => {
        const topTenArray = response.body.videos;
        console.log("Top ten: ", topTenArray);
        if (topTenArray) {
          topTenArray.map((video) => {
            const title = video.title;
            const description = video.description;
            const thumbnail = video.preview;
            const url = video.url;
            this.setState({
              twitchTopTen: this.state.twitchTopTen.concat({
                title,
                description,
                thumbnail,
                url
              }),
              loading: false
            });
          });
        }
      })
      .catch( function(error) {
        console.log(error);
      });
  }
  componentWillMount() {
    console.log('Mounting!');
    this.setState({
      loading: true
    });
  }
  componentDidMount() {
    console.log('Mounted!');
    console.log(this.state.users);
    const { userNames } = this.state;

    userNames.forEach((user) => {
      this.fetchStreamData(user)
    })
    this.fetchTopVideosData();
  }
  renderList () {
    const filteredUsers = this.state.filteredUsers || this.state.users;
    return (
      <List selectable ripple>
        {filteredUsers.map((user) => {
          return (
            <ListItem
              key={user.name}
              avatar={user.logo}
              caption={user.name}
              legend={user.streamTitle}
              rightIcon={user.online ? 'live_tv' : 'error'}
              to={user.url}
            />
          );
        })}
      </List>
    );
  }
  renderCards () {
    const topTenUsers = this.state.twitchTopTen.slice(6);

    return (
      topTenUsers.map((user) => {
        return (
          <Col key={user.id} xs={6} sm={3}>
            <Card key={user.id} className={style.card}>
              <CardMedia
                aspectRatio="wide"
                image={user.thumbnail}
              />
              <CardTitle
                subtitle={user.title}
              />
              <CardActions>
                <Button href={user.url} target="_blank" label="View Channel" primary />
              </CardActions>
            </Card>
          </Col>
        );
      })
    );
  }
  handleSearchInputChange (value) {
    let updatedUsers = this.state.users;
    updatedUsers = updatedUsers.filter((user) => {
      return user.name.toLowerCase().startsWith(value.toLowerCase());
    });

    this.setState({
      query: value,
      filteredUsers: updatedUsers
    });
  }
  handleSearchInputBlur () {
    this.setState({
      query: '',
      filteredUsers: undefined
    });
  }
  handleTabChange (index) {
    this.setState({
      tabIndex: index
    });
  }
  handleAllTabClick () {
    let allUsers = this.state.users;

    this.setState({
      filteredUsers: allUsers
    });
  }
  handleOnlineTabClick () {
    let updatedUsers = this.state.users;

    updatedUsers = updatedUsers.filter((user) => {
      return user.online;
    });

    this.setState({
      filteredUsers: updatedUsers
    });
  }
  handleOfflineTabClick () {
    let updatedUsers = this.state.users;

    updatedUsers = updatedUsers.filter((user) => {
      return !user.online;
    });

    this.setState({
      filteredUsers: updatedUsers
    });
  }
  render() {
    return(
      <ToolboxApp>
        <Header />
        <Grid className={style.fullwidth}>
          <Row className={style.topTitle}><h5>Top Channels</h5></Row>
          <Row>
            {this.renderCards()}
          </Row>
        </Grid>

        <Grid className={style.globalPadding}>
          <Row>
            <Col xs={12}>
              { this.state.loading ? <Spinner /> :
                <div>
                  <Input
                    icon='search'
                    type='search'
                    label='Search'
                    value={this.state.query}
                    onChange={this.handleSearchInputChange}
                    onBlur={this.handleSearchInputBlur}
                  />

                  <Tabs index={this.state.tabIndex} onChange={this.handleTabChange}>
                    <Tab ref='all' label='All' onActive={this.handleAllTabClick}>
                      { this.renderList() }
                    </Tab>
                    <Tab ref='online' label='Online' onActive={this.handleOnlineTabClick}>
                      { this.renderList() }
                    </Tab>
                    <Tab ref='offline' label='Offline' onActive={this.handleOfflineTabClick}>
                      { this.renderList() }
                    </Tab>
                  </Tabs>
                </div>
              }
            </Col>
          </Row>
        </Grid>
      </ToolboxApp>
    );
  }
}
