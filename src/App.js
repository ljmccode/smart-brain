import React, { Component } from 'react';
// import Particles from 'react-particles-js';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';
import './App.css';

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  async componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    try {
      if (token) {
        const response = await fetch('http://localhost:3000/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        });
        const userInfo = await response.json();

        if (userInfo && userInfo.id) {
          await this.getUserProfile(userInfo.id, token);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  getUserProfile = async (id, token) => {
    try {
      const response = await fetch(`http://localhost:3000/profile/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      const user = await response.json();
      if (user && user.email) {
        this.loadUser(user);
        this.onRouteChange('home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return data.outputs[0].data.regions.map((face) => {
        const clarifaiFace = face.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return;
  };

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  getUserEntries = async () => {
    try {
      const response = await fetch('http://localhost:3000/image', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          Authorization: window.sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          id: this.state.user.id,
        }),
      });
      const count = await response.json();
      this.setState(Object.assign(this.state.user, { entries: count }));
    } catch (error) {
      console.log(error);
    }
  };

  onButtonSubmit = async () => {
    this.setState({ imageUrl: this.state.input });
    try {
      const response = await fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: window.sessionStorage.getItem('token'),
        },
        body: JSON.stringify({
          input: this.state.input,
        }),
      });
      const clarifaiData = await response.json();
      if (clarifaiData) {
        await this.getUserEntries();
      }
      this.displayFaceBox(this.calculateFaceLocation(clarifaiData));
    } catch (error) {
      console.log(error);
    }
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState((state) => ({
      ...state,
      isProfileOpen: !state.isProfileOpen,
    }));
  };

  render() {
    const { isSignedIn, imageUrl, route, boxes, isProfileOpen, user } =
      this.state;
    return (
      <div className="App">
        <ParticlesBg type="circle" bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              isProfileOpen={isProfileOpen}
              toggleModal={this.toggleModal}
              loadUser={this.loadUser}
              user={user}
            />
          </Modal>
        )}
        {route === 'home' ? (
          <div>
            <Logo />

            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div>
        ) : route === 'signin' ? (
          <Signin
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
            getUserProfile={this.getUserProfile}
          />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
            getUserProfile={this.getUserProfile}
          />
        )}
      </div>
    );
  }
}

export default App;
