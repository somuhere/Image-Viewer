import React, { Component } from 'react';
import './Header.css';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

class Header extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
        }
    }

    handleToggle = () => {
        this.setState(state => ({open: !state.open}));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({open: false});
    };

    myAccountHandler = (e) => {
        
        this.handleClose(e);

        // Take to the profile page
        this.props.myAccountHandler();
    }

    logoutHandler = (e) => {
        
        this.handleClose(e);

        //Redirect to login page and clear session data
        this.props.logoutHandler();
    }

    render() {
        const {open} = this.state;
        return (
            <div>
                <header className='class-header'>

                    {/* Whn logged in clicking the Image Viewer logo to take to homepage */}
                    {this.props.redirectToHome ?
                        <Link to='/home'>
                            <span className='class-logo'>Image Viewer</span>
                        </Link>
                        :
                        <span className='class-logo'>Image Viewer</span>
                    }

                    {/* page components to be loaded based on whether the profile picture should be displayed if login is success otherwise nothing to show */}
                    {this.props.showProfilePicture ?
                        <div id='profile-pic-icon'>
                            <IconButton
                                buttonRef={node => {
                                    this.anchorEl = node;
                                }}
                                aria-owns={open ? 'menu-list-grow' : undefined}
                                aria-haspopup='true'
                                onClick={this.handleToggle}
                            >
                                <Avatar id='profile-pic-avatar' alt='Profile picture' src={this.props.profilePictureUrl} />
                            </IconButton>
                            <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                                {({TransitionProps, placement}) => (
                                    <Grow
                                        {...TransitionProps}
                                        id='menu-list-grow'
                                        style={{transferOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={this.handleClose}>
                                                <MenuList id='menu-list'>
                                                    {this.props.showMyAccountMenu ?
                                                        <div>
                                                            <MenuItem onClick={this.myAccountHandler}>My Account</MenuItem>
                                                            <Divider />
                                                        </div>
                                                        : ''
                                                    }
                                                    <MenuItem onClick={this.logoutHandler}>Logout</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </div>
                        : ''
                    }

                    {/* page components to be loaded based on whether the search box should be displayed if login is success otherwise nothing to show*/}
                    {this.props.showSearchBox ?
                        <div className='searchbox'>
                            <SearchIcon id='searchbox-icon' />
                            <Input id='searchbox-input' type='text' placeholder='Search...' disableUnderline={true} onChange={this.props.searchHandler} />
                        </div>
                        : ''
                    }

                </header>
            </div>
        )
    }
}

export default Header;
