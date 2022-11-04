import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };

  onSignOut = async () => {
    try {
      await fetch('http://localhost:3000/signout', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: window.sessionStorage.getItem('token'),
        },
      });
    } catch (err) {
      console.log(err);
    }
    window.sessionStorage.removeItem('token');
    this.props.onRouteChange('signout');
  };

  render() {
    return (
      <div className="pa4 tc">
        <Dropdown
          isOpen={this.state.dropdownOpen}
          toggle={this.toggle}
          drop="left"
        >
          <DropdownToggle
            tag="span"
            onClick={this.toggle}
            data-toggle="dropdown"
            aria-expanded={this.state.dropdownOpen}
          >
            <img
              src="https://ps.w.org/simple-user-avatar/assets/icon-256x256.png?rev=2413146"
              className="br-100 h3 w3 dib"
              alt="avatar"
            />
          </DropdownToggle>
          <DropdownMenu
            className="b--transparent shadow-5"
            style={{
              marginLeft: '-6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <DropdownItem onClick={() => this.props.toggleModal()}>
              View Profile
            </DropdownItem>
            <DropdownItem onClick={this.onSignOut}>Sign Out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
