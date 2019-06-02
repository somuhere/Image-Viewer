import React, { Component } from 'react';
import './Profile.css';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ModalBox from '../../common/modal/Modal';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';


const styles = theme => ({
    fullnameEditHeading: {
        marginBottom: 30,
    },
    fullnameEditField: {
        width: "100%",
    },
    tags: {
        color: "#82C0FF",
    },
    favoriteIconGridItem: {
        marginTop: 5,
    },
    likesCount: {
        marginTop: '10%',
        fontWeight: 'bold',
        marginLeft: 5,
    },
});

class Profile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            USER_DATA: null,
            USER_MEDIA: null,
            openModal: false,
            openDetailModal: false,
            selectedImage: null,
            comment: '',
            full_name: '',
            invalidFullName: false,
            userComments: {},
            likesState: {},
        }
    }

    getOwnerInfo = () => {
        let data = null;
        let url = `${this.props.userInfoUrl}${this.props.accessToken}`;
        let xhr = new XMLHttpRequest();
        let self = this;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let OWNER_INFO_DATA = JSON.parse(this.responseText)
                self.setState({ USER_DATA: OWNER_INFO_DATA.data, full_name: OWNER_INFO_DATA.data.full_name })
            }
        }
        xhr.open("GET", url);
        xhr.send(data);
    }

    componentDidMount() {
        this.getOwnerInfo();
    }


    gridCallbackHandler = (data) => {
        this.setState({ openModal: true, selectedImage: data });
    }

    editFullName = () => {
        this.setState({ openDetailModal: true });
    }

    closeImageModalHandler = () => {
        this.setState({ openModal: false, openDetailModal: false, invalidFullName: false });
    }

    updateFullName = (event) => {
        if (this.state.full_name) {
            event.preventDefault();
            let userdataWithUpdatedName = { ...this.state.USER_DATA, 'full_name': this.state.full_name };
            this.setState({ USER_DATA: userdataWithUpdatedName, invalidFullName: false });
            this.closeImageModalHandler();
        } else {
            this.setState({ invalidFullName: true, full_name: this.state.USER_DATA.full_name });
        }
    }

    handleInputChange = inputType => event => {
        this.setState({ [inputType]: event.target.value });
    };

    logoutHandler = () => {
        
        sessionStorage.clear();
        this.props.history.push("/");
    }

    render() {
        const userData = this.state.USER_DATA;
        const { openModal, selectedImage, openDetailModal } = this.state;
        const { classes } = this.props;

        return (
            <div className='top-div'>

                
                {userData && <Header
                    showProfilePicture={true}
                    redirectToHome={true}
                    logoutHandler={this.logoutHandler}
                    profilePictureUrl={userData.profile_picture}
                />}

                
                {userData && <div className="container flex-container usredit">

                    

                    <img className="profile-pic flex-item" src={userData.profile_picture} alt="profile pic" />
                    <div className="flex-container-column-1">

                        
                        <Typography variant="h5" className="flex-item" style={{ display: "flex" }}>
                            {userData.username}
                        </Typography>

                        
                        <div className="flex-container-1">
                            <p className="flex-1">Posts: {userData.counts.media}</p>
                            <p className="flex-1">Follows: {userData.counts.follows}</p>
                            <p className="flex-2">Followed By: {userData.counts.followed_by}</p>
                        </div>

                        <div className="flex-container">

                            
                            <Typography variant='h6' className="flex-item" style={{ display: "flex", marginTop: 15 }}>
                                {userData.full_name}
                            </Typography>

                            
                            <Fab color='secondary' className={'editBtn'} onClick={this.editFullName}>
                                <EditIcon />
                            </Fab>

                            
                            <ModalBox openModal={openDetailModal} closeModal={this.closeImageModalHandler} widthClass={'userDetailModalClass'}>
                                <div className="flex-container-column justify-content-end">
                                    <FormControl className="flex-container">
                                        <Typography className={classes.fullnameEditHeading} variant='h5'>Edit</Typography>
                                        <TextField
                                            className={classes.fullnameEditField}
                                            id="fullName"
                                            label="Full Name *"
                                            placeholder="Full Name *"
                                            margin="normal"
                                            onChange={this.handleInputChange('full_name')}
                                            value={this.state.full_name}
                                        />
                                        {this.state.invalidFullName ? <FormHelperText style={{ color: 'red' }}>required</FormHelperText> : ''}
                                    </FormControl>
                                </div>
                                <Button type="submit" variant="contained" className={"addBtn"} color="primary" onClick={this.updateFullName}>UPDATE</Button>
                            </ModalBox>
                        </div>
                    </div>
                </div>}

                         

                
                
            </div>
        )
    }
}

export default withStyles(styles)(Profile);
