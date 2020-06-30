import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  checkAniListToken,
  getLanguages,
  removeAniList,
  setHomepageContinueCount,
  setLanguage,
  setTheme,
  toggleAutoplay,
  toggleOrderControls,
} from "../../actions";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Col,
  Label,
  Input,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Options.scss";

class Options extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      error: "",
      anilist: {
        token: "",
      },
    };

    this.toggle = this.toggle.bind(this);
    this.authAniList = this.authAniList.bind(this);
    this.listenForColourTheme = this.listenForColourTheme.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getLanguages());

    this.listenForColourTheme();
  }

  toggle() {
    this.setState({
      open: !this.state.open,
    });
  }

  async authAniList(e) {
    // don't submit!
    e.preventDefault();
    const {
      anilist: { token },
    } = this.state;
    const { dispatch } = this.props;
    try {
      await dispatch(checkAniListToken(token));
      this.setState({ error: "", anilist: { token: "" } });
    } catch (err) {
      console.error(err);
      this.setState({
        error:
          (err.response && err.response.data && err.response.data.error) ||
          "Something went wrong.",
      });
    }
  }

  listenForColourTheme() {
    const { dispatch, autoTheme } = this.props;

    const themeSet = (theme) => dispatch(setTheme(theme));

    // if either is supported, set to initial and listen
    const dark = window.matchMedia("(prefers-color-scheme: dark)");
    const light = window.matchMedia("(prefers-color-scheme: light)");
    if ((dark.matches || light.matches) && autoTheme) {
      themeSet(light.matches ? "light" : "dark");
      light.addListener((e) => {
        this.props.autoTheme && themeSet(e.matches ? "light" : "dark");
      });
    }
  }

  render() {
    const { open, anilist } = this.state;
    const {
      anilist: anilistAuth,
      language,
      languages,
      autoplay,
      orderControls,
      theme,
      continueCount,
      dispatch,
    } = this.props;
    const loggedInAniList = anilistAuth.username && anilistAuth.token;
    return (
      <Fragment>
        <Button onClick={this.toggle} className="w-100">
          <FontAwesomeIcon icon="cog" />
        </Button>
        <Modal className="options-modal" isOpen={open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Options</ModalHeader>
          <ModalBody>
            <h3>Preferences</h3>
            <div className="preferences row">
              <Label for="theme" sm={6}>
                Theme
              </Label>
              <div className="col-sm-6 d-flex align-items-center">
                <select
                  className="custom-select"
                  id="theme"
                  value={theme}
                  onChange={({ target: { value } }) =>
                    dispatch(setTheme(value))
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            <div className="row">
              <Label for="language" sm={6}>
                Content Language
              </Label>
              <div className="col-sm-6 d-flex align-items-center">
                <select
                  className="custom-select"
                  id="language"
                  value={language}
                  onChange={({ target: { value } }) =>
                    dispatch(setLanguage(value))
                  }
                >
                  {languages.map((language) => (
                    <option value={language.id} key={`language-${language.id}`}>
                      {language.text}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row">
              <Label for="autoplay" sm={6}>
                Autoplay video?
              </Label>
              <div className="col-sm-6 d-flex align-items-center">
                <input
                  type="checkbox"
                  id="autoplay"
                  checked={autoplay}
                  onChange={() => dispatch(toggleAutoplay())}
                />
              </div>
            </div>
            <div className="row">
              <Label for="orderControls" sm={6}>
                Show episode order controls?
              </Label>
              <div className="col-sm-6 d-flex align-items-center">
                <input
                  type="checkbox"
                  id="orderControls"
                  checked={orderControls}
                  onChange={() => dispatch(toggleOrderControls())}
                />
              </div>
            </div>
            <div className="row">
              <Label for="watchCardCount" sm={10}>
                Dashboard "Continue Watching" episode card count:
              </Label>
              <div className="col-sm-2 d-flex align-items-center justify-content-end">
                <select
                  onChange={({ target: { value } }) =>
                    dispatch(setHomepageContinueCount(value))
                  }
                  value={continueCount}
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
              </div>
            </div>

            <br />

            <h3 className="border-bottom pb-2 mb-3">AniList</h3>
            {!loggedInAniList ? (
              <Form onSubmit={this.authAniList}>
                <FormGroup row>
                  <div className="col-8">
                    Click the the button on the right to login with AniList.
                    Copy the token you get into the field below and click
                    "Save".
                  </div>
                  <div className="col-4 d-flex align-items-center">
                    <Button
                      color="info"
                      block
                      href="https://anilist.co/api/v2/oauth/authorize?client_id=470&response_type=token"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Login
                    </Button>
                  </div>
                </FormGroup>
                <FormGroup row>
                  <Label for="token" sm={2}>
                    Token
                  </Label>
                  <Col sm={10}>
                    <Input
                      required
                      type="text"
                      name="token"
                      id="token"
                      placeholder="Token"
                      value={anilist.token}
                      onChange={({ target: { value } }) =>
                        this.setState({ anilist: { ...anilist, token: value } })
                      }
                    />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Button type="submit" color="success" block>
                    Save
                  </Button>
                </FormGroup>
              </Form>
            ) : (
              <div className="d-flex justify-content-between">
                Logged In ({anilistAuth.username})
                <Button onClick={() => dispatch(removeAniList())}>
                  Logout
                </Button>
              </div>
            )}
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default connect((store) => {
  return {
    orderControls: store.Options.orderControls,
    autoplay: store.Options.autoplay,
    language: store.Options.language,
    theme: store.Options.theme,
    autoTheme: store.Options.autoThemeChange,
    continueCount: store.Options.homepageContinueCount,
    languages: store.Data.languages,
    anilist: store.Auth.anilist,
  };
})(Options);
