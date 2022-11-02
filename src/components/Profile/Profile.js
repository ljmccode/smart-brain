import './Profile.css';

const Profile = ({ isProfileOpen, toggleModal, user }) => {
  const { name, pet, age, entries, joined } = user;

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
        <main className="pa4 black-80 w-80">
          <img
            src="https://ps.w.org/simple-user-avatar/assets/icon-256x256.png?rev=2413146"
            className="h3 w3 dib"
            alt="avatar"
          />
          <h1>{name}</h1>
          <h4>{`Images submitted: ${entries}`}</h4>
          <p>{`Member since: ${new Date(joined).toLocaleDateString()}`}</p>
          <hr />
          <label className="mt2 fw6" htmlFor="user-name">
            Name:
          </label>
          <input
            // onChange={this.onFormChange}
            type="text"
            name="user-name"
            className="pa2 ba w-100"
            placeholder={name}
          ></input>
          <label className="mt2 fw6" htmlFor="user-age">
            Age:
          </label>
          <input
            // onChange={this.onFormChange}
            type="text"
            name="user-age"
            className="pa2 ba w-100"
            placeholder={age}
          ></input>
          <label className="mt2 fw6" htmlFor="user-pet">
            Favourite Pet:
          </label>
          <input
            // onChange={this.onFormChange}
            type="text"
            name="user-pet"
            className="pa2 ba w-100"
            placeholder={pet}
          ></input>
          <div
            className="mt4"
            style={{ display: 'flex', justifyContent: 'space-evenly' }}
          >
            <button
              className="b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20"
              onClick={() => this.onProfileUpdate({ name, age, pet })}
            >
              Save
            </button>
            <button
              className="b pa2 grow pointer hover-white w-40 bg-light-red b--black-20"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </main>
        <div className="modal-close" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
