import React, { Component } from 'react';
import './Home.css';
import Header from '../../common/header/Header';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import indigo from '@material-ui/core/colors/indigo';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

const styles = theme => ({
    cardsGridList: {
        width: '90%',
    },
    card: {
        maxWidth: 600,
        marginTop: 30,
        marginBottom: 30,
        marginLeft: 5,
    },
    cardHeaderTitle: {
        fontWeight: 'bold',
    },
    cardHeaderSubheader: {
        fontWeight: 'bold',
        fontSize: 15,
    },
    cardImage: {
        height: '100%',
        width: '100%',
    },
    caption: {
        fontWeight: 'bold',
    },
    tags: {
        color: '#82C0FF',
    },
    favoriteIconGridItem: {
        marginTop: 5,
    },
    likesCount: {
        marginTop: '10%',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    commentForm: {
        width: '80%',
    },
    commentLabel: {
        '&$commentFocused': {
            color: indigo[500],
        },
    },
    commentFocused: {},
    commentInputUnderline: {
        '&:after': {
            borderBottomColor: indigo[500],
        },
    },
    commentButton: {
        marginTop: 15,
        marginLeft: 10,
    },
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            userPosts: [],
            userInfo: {},
            filteredUserPosts: [],
            userComments: {},
            likesState: {},
        }
    }

    componentWillMount() {
        let that = this;

        // Retrieve user information
        let userInformation = null;
        let xhrUserInfo = new XMLHttpRequest();
        xhrUserInfo.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                that.setState({
                    userInfo: JSON.parse(this.responseText).data
                })
            }
        })

        xhrUserInfo.open('GET', `${this.props.userInfoUrl}${this.props.accessToken}`);
        xhrUserInfo.send(userInformation);

        // Get the most recent media published by the owner of the access_token.
        let userPostsInformation = null;
        let xhrUserPosts = new XMLHttpRequest();
        xhrUserPosts.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let likesState = {};
                let userComments = {};
                let data = JSON.parse(this.responseText).data;
                for (let i = 0; i < data.length; i++) {
                    likesState[data[i]['id']] = false
                    userComments[data[i]['id']] = { 'added': [], 'toAdd': '' }
                }
                that.setState({
                    userPosts: data,
                    filteredUserPosts: data,
                    likesState: likesState,
                    userComments: userComments
                });
            }
        });

        xhrUserPosts.open('GET', `${this.props.userMediaRecentUrl}${this.props.accessToken}`);
        xhrUserPosts.send(userPostsInformation);
    }

    // converts unix timestamp to 'dd/mm/yyyy HH:MM:SS' format
    convertTimeFormat(unixTimestamp) {

        let dateTimeVar = new Date(unixTimestamp * 1000);
        let timeDict = {
            date: dateTimeVar.getDate(),
            month: dateTimeVar.getMonth() + 1,
            year: dateTimeVar.getFullYear(),
            hours: dateTimeVar.getHours(),
            minutes: dateTimeVar.getMinutes(),
            seconds: dateTimeVar.getSeconds()
        }

        let timeKeys = Object.keys(timeDict);
        for (var i = 0; i < timeKeys.length; i++) {
            let timeValue = timeDict[timeKeys[i]];
            timeDict[timeKeys[i]] = timeValue < 10 ? '0' + timeValue : timeValue;
        }
        return `${timeDict.date}/${timeDict.month}/${timeDict.year} ${timeDict.hours}:${timeDict.minutes}:${timeDict.hours}`;
    }

    // Redirect to profile page
    myAccountHandler = () => {
        this.props.history.push('/profile');
    }

    // Redirect to login page when logged out after clearing session memory
    logoutHandler = () => {
        sessionStorage.clear();
        this.props.history.push("/");
    }

    searchHandler = (event) => {
        let resultPosts = this.state.userPosts.filter(function (post) {
            return post.caption.text.split('\n')[0].toLowerCase().includes(event.target.value.toLowerCase());
        });
        this.setState({ filteredUserPosts: resultPosts });
    }

    toggleLikeCount(postId, likeState) {
        let newUserPosts = Object.assign({}, this.state.userPosts);
        let count = null;
        for (let i = 0; i < Object.keys(newUserPosts).length; i++) {
            if (newUserPosts[i]['id'] === postId) {
                if (likeState) {
                    count = newUserPosts[i].likes.count + 1;
                    newUserPosts[i].likes.count = count;
                } else {
                    count = newUserPosts[i].likes.count - 1;
                    newUserPosts[i].likes.count = count;
                }
                break;
            }
        }

        let newFilteredUserPosts = Object.assign({}, this.state.filteredUserPosts);
        for (let i = 0; i < Object.keys(newFilteredUserPosts).length; i++) {
            if (newFilteredUserPosts[i]['id'] === postId) {
                newFilteredUserPosts[i].likes.count = count;
                break;
            }
        }

        let newLikesState = Object.assign({}, this.state.likesState);
        newLikesState[postId] = likeState;
        this.setState({
            userPosts: Object.values(newUserPosts),
            filteredUserPosts: Object.values(newFilteredUserPosts),
            likesState: newLikesState,
        });
    }

    likeHandler = (postId) => {
        if (this.state.likesState[postId]) {
            // decrement like
            this.toggleLikeCount(postId, false);
        }
        else {
            // increment like
            this.toggleLikeCount(postId, true);
        }
    }

    commentInputChangeHandler = (userComment, postId) => {
        let newUserComments = Object.assign({}, this.state.userComments);
        newUserComments[postId]['toAdd'] = userComment;
        this.setState({ userComments: newUserComments });
    }

    addCommentHandler = (postId) => {
        if (this.state.userComments[postId]['toAdd']) {
            let newUserComments = Object.assign({}, this.state.userComments);
            newUserComments[postId]['added'].push(newUserComments[postId]['toAdd']);
            newUserComments[postId]['toAdd'] = '';
            this.setState({ userComments: newUserComments });
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div>

                {/* Rendering Header Component and assigning values to props in Header.js to display conditional blocks */}
                <Header
                    showSearchBox={true}
                    showProfilePicture={true}
                    showMyAccountMenu={true}
                    myAccountHandler={this.myAccountHandler}
                    logoutHandler={this.logoutHandler}
                    searchHandler={this.searchHandler}
                    profilePictureUrl={this.state.userInfo.profile_picture}
                />

                <div id='cards-grid-list'>
                    <GridList cols={2} cellHeight='auto' className={classes.cardsGridList}>

                        {/* Code to List The Posts on Istagram account with the access-token */}
                        {this.state.filteredUserPosts.map(post => (
                            <GridListTile key={'post' + post.id}>

                                <Card className={classes.card}>
                                    <CardHeader
                                        classes={{
                                            title: classes.cardHeaderTitle,
                                            subheader: classes.cardHeaderSubheader,
                                        }}

                                        // card header - user profile pic of the posting user
                                        avatar={
                                            <Avatar alt='Profile picture' src={post.user.profile_picture} />
                                        }

                                        // card header - username and date time
                                        title={post.user.username}
                                        subheader={this.convertTimeFormat(post.created_time)}
                                    />
                                    <CardContent>

                                        <img className={classes.cardImage} src={post.images.standard_resolution.url} alt={post.caption.text}/> {/* Retriving Image */}

                                        <hr /> {/* To display horizontal line below the image */}

                                        
                                        <Typography className={classes.caption} variant='subtitle1'>
                                            {post.caption.text.split('\n')[0]}  
                                        </Typography>

                                        <Typography className={classes.tags} variant='subtitle2'>
                                            {post.tags.map(function (t) { return `#${t} ` })} {/* Displaying hashtags of the image*/}
                                        </Typography>

                                        {/* Displaying the favourite icon in red if the user likes otherwise with just border if it is not liked yet */}
                                        <Grid container={true} direction='row' alignItems='center'>
                                            <Grid item={true} className={classes.favoriteIconGridItem}>
                                                <IconButton onClick={() => this.likeHandler(post.id)}>
                                                    {this.state.likesState[post.id] ?
                                                        <FavoriteIcon color='secondary' fontSize='default' /> :  
                                                        <FavoriteBorderIcon fontSize='default' />    
                                                    }
                                                </IconButton>
                                            </Grid>
                                            <Grid item={true}>
                                                <Typography className={classes.likesCount} variant='body2'>
                                                    {post.likes.count} likes    {/* Displaying number of likes for the post */}
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        {/* Displaying User name and comments posted by user */}
                                        <List style={{ marginTop: '-5%' }}>
                                            {this.state.userComments[post.id]['added'].map((userComment, index) => (
                                                <ListItem key={post.id + 'comment' + index} style={{ marginBottom: '-5%' }}>
                                                    <Typography variant='body1' style={{ fontWeight: 'bold' }}>{post.user.username}:</Typography>
                                                    <Typography variant='subtitle1' style={{ marginLeft: 5 }}>{userComment}</Typography>
                                                </ListItem>
                                            ))}
                                        </List>

                                        {/* Block to add the comment */}
                                        <div id='comment-div'>
                                            <FormControl className={classes.commentForm}>
                                                <InputLabel
                                                    classes={{
                                                        root: classes.commentLabel,
                                                        focused: classes.commentFocused,
                                                    }}
                                                >
                                                    Add a comment
                                                </InputLabel>
                                                <Input
                                                    classes={{
                                                        underline: classes.commentInputUnderline,
                                                    }}
                                                    value={this.state.userComments[post.id]['toAdd']}
                                                    onChange={(event) => this.commentInputChangeHandler(event.target.value, post.id)}
                                                />
                                            </FormControl>
                                            <Button
                                                className={classes.commentButton}
                                                variant='contained'
                                                color='primary'
                                                onClick={() => this.addCommentHandler(post.id)}
                                            >
                                                ADD
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Home);
