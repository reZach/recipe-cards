import milk from "./milk-bottle.svg";
import * as React from "react";
import { jsPDF } from "jspdf";
import "./App.css";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/js/all.js";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      prep: "",
      cook: "",
      servings: "",
      ingredients: "",
      steps: [""],
      vegetarian: false,
      gluten: false,
      lactose: false,
      seafood: false,
      spicy: false,
    };

    this.setTitle = this.setTitle.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setIngredients = this.setIngredients.bind(this);
    this.setPrep = this.setPrep.bind(this);
    this.setCook = this.setCook.bind(this);
    this.setServings = this.setServings.bind(this);
    this.setStep = this.setStep.bind(this);
    this.addStep = this.addStep.bind(this);
    this.removeStep = this.removeStep.bind(this);
    this.setVegetarian = this.setVegetarian.bind(this);
    this.setGluten = this.setGluten.bind(this);
    this.setLactose = this.setLactose.bind(this);
    this.setSeafood = this.setSeafood.bind(this);
    this.setSpicy = this.setSpicy.bind(this);
    this.download = this.download.bind(this);
    this.renderSteps = this.renderSteps.bind(this);
    this.renderFrontPreview = this.renderFrontPreview.bind(this);
    this.renderBackPreview = this.renderBackPreview.bind(this);
  }

  setTitle(event) {
    const value = event.target.value;
    this.setState({
      title: value,
    });
  }

  setDescription(event) {
    const value = event.target.value;
    this.setState({
      description: value,
    });
  }

  setIngredients(event) {
    const value = event.target.value;
    this.setState({
      ingredients: value,
    });
  }

  setPrep(event) {
    const value = event.target.value;
    this.setState({
      prep: value,
    });
  }

  setCook(event) {
    const value = event.target.value;
    this.setState({
      cook: value,
    });
  }

  setServings(event) {
    const value = event.target.value;
    this.setState({
      servings: value,
    });
  }

  setStep(event, index) {
    const value = event.target.value;

    let steps = this.state.steps;
    if (index < steps.length) {
      steps[index] = value;

      this.setState({
        steps,
      });
    }
  }

  addStep(event) {
    event.preventDefault();

    let steps = this.state.steps;
    steps.push("");

    this.setState({ steps });
  }

  removeStep(event) {
    event.preventDefault();

    let steps = this.state.steps;
    steps.pop();

    this.setState({ steps });
  }

  setVegetarian(event) {
    const value = event.target.checked;
    this.setState({
      vegetarian: value,
    });
  }

  setGluten(event) {
    const value = event.target.checked;
    this.setState({
      gluten: value,
    });
  }

  setLactose(event) {
    const value = event.target.checked;
    this.setState({
      lactose: value,
    });
  }

  setSeafood(event) {
    const value = event.target.checked;
    this.setState({
      seafood: value,
    });
  }

  setSpicy(event) {
    const value = event.target.checked;
    this.setState({
      spicy: value,
    });
  }

  download(event) {
    const newPDF = new jsPDF({
      orientation: "landscape",
      format: [152.4, 88.9] // 6in by 3.5in
    });
    newPDF.html(document.querySelector("#front"), {
      callback: function (doc) {
        doc.save();
      }
   });
  }

  renderSteps() {
    let steps = [];

    for (let i = 0; i < this.state.steps.length; i++) {
      steps.push(
        <div className="field" key={i}>
          <label className="label">{i + 1}</label>
          <div className="control">
            <textarea
              className="textarea"
              value={this.state.steps[i]}
              onChange={(e) => this.setStep(e, i)}
            ></textarea>
          </div>
        </div>
      );
    }

    return steps;
  }

  renderFrontPreview() {
    return (
      <div className="container card-preview" id="front">
        <section className="hero is-info">
          <div className="hero-body pt-4 pb-4 pl-5 pr-5">
            <div className="container">
              <h3 className="title is-3">{this.state.title}</h3>
            </div>
          </div>
        </section>
        <section className="section pt-4">
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h4
                  className="title is-4 mb-4 pb-1"
                  style={{ borderBottom: "2px solid #363636" }}
                >
                  Ingredients
                </h4>
                <ol type="1" className="pl-4">
                  {this.state.ingredients
                    .split("\n")
                    .map((value, index, array) => {
                      return <li key={index}>{value}</li>;
                    })}
                </ol>
              </div>
              <div className="column is-three-fifths">
                <h4
                  className="title is-4 mb-4 pb-1"
                  style={{ borderBottom: "2px solid #363636" }}
                >
                  Steps
                </h4>
                <ol type="1" className="pl-4">
                  {this.state.steps.map((value, index, array) => {
                    return <li key={index}>{value}</li>;
                  })}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  renderBackPreview() {
    return (
      <div className="container card-preview" id="back">
        <section className="hero is-info is-fullheight">
          <div className="hero-body pl-0 pr-0">
            <div
              className="container"
              style={{ border: "6px solid white", backgroundColor: "white" }}
            >
              <h1
                className="title has-text-centered"
                style={{ color: "#363636" }}
              >
                {this.state.title}
              </h1>
              <h2
                className="subtitle has-text-centered"
                style={{ color: "#363636" }}
              >
                {this.state.description}
              </h2>
            </div>
          </div>
        </section>
        <div className="badges">
          {this.state.vegetarian ? (
            <span className="icon ml-2 pt-2">
              <i className="fas fa-leaf fa-2x"></i>
            </span>
          ) : null}
          {this.state.gluten ? (
            <span className="icon ml-2 pt-2">
              <i className="fas fa-bread-slice fa-2x"></i>
            </span>
          ) : null}
          {this.state.lactose ? (
            <span className="icon ml-2 pt-2">
              <img src={milk} alt="Milk jug" />
            </span>
          ) : null}
          {this.state.seafood ? (
            <span className="icon ml-2 pt-2">
              <i className="fas fa-fish fa-2x"></i>
            </span>
          ) : null}
          {this.state.spicy ? (
            <span className="icon ml-2 pt-2">
              <i className="fas fa-pepper-hot fa-2x"></i>
            </span>
          ) : null}
        </div>
        <div className="tiled-info pl-4 pb-2">
          <div>
            <span className="times">{this.state.prep}</span>
            <span className="icon is-left ml-4 pr-4">
              <i className="fas fa-hands fa-2x"></i>
            </span>
          </div>
          <div>
            <span className="times">{this.state.cook}</span>
            <span className="icon is-left ml-4 pr-4">
              <i className="fas fa-fire fa-2x"></i>
            </span>
          </div>
          <div>
            <span className="times">{this.state.servings}</span>
            <span className="icon is-left ml-4 pr-4">
              <i className="fas fa-utensils fa-2x"></i>
            </span>
          </div>
        </div>
        <div className="built-by">
          Built by https://github.com/reZach/recipe-cards
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="/">
              <img
                src="https://bulma.io/images/bulma-logo.png"
                width="112"
                height="28"
                alt="Bulma logo"
              />
            </a>

            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-start">
              <a className="navbar-item">Home</a>

              <a className="navbar-item">Documentation</a>

              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">More</a>

                <div className="navbar-dropdown">
                  <a className="navbar-item">About</a>
                  <a className="navbar-item">Jobs</a>
                  <a className="navbar-item">Contact</a>
                  <hr className="navbar-divider" />
                  <a className="navbar-item">Report an issue</a>
                </div>
              </div>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <a className="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a className="button is-light">Log in</a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <section className="hero is-primary">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Recipe Cards</h1>
              <h2 className="subtitle">
                Create recipe cards for your favorite recipes
              </h2>
            </div>
          </div>
        </section>
        {/* <section className="section">
          <div className="container">
            <h1 className="title">Hello World</h1>
            <p className="subtitle">
              My first website with <strong>Bulma</strong>!
            </p>
          </div>
        </section> */}
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column is-half">
                <form>
                  <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Recipe title"
                        autoFocus={true}
                        value={this.state.title}
                        onChange={this.setTitle}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        placeholder="Description of recipe"
                        value={this.state.description}
                        onChange={this.setDescription}
                      />
                    </div>
                  </div>
                  <div className="field is-horizontal">
                    <div className="field-body">
                      <div className="field">
                        <p className="control is-expanded">
                          <input
                            className="input"
                            type="text"
                            placeholder="Prep time"
                            value={this.state.prep}
                            onChange={this.setPrep}
                          />
                        </p>
                      </div>
                      <div className="field">
                        <p className="control is-expanded">
                          <input
                            className="input"
                            type="text"
                            placeholder="Cook time"
                            value={this.state.cook}
                            onChange={this.setCook}
                          />
                        </p>
                      </div>
                      <div className="field">
                        <p className="control is-expanded">
                          <input
                            className="input"
                            type="text"
                            placeholder="Servings"
                            value={this.state.servings}
                            onChange={this.setServings}
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Ingredients</label>
                    <div className="control">
                      <textarea
                        className="textarea"
                        placeholder="Recipe ingredients"
                        value={this.state.ingredients}
                        onChange={this.setIngredients}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Steps</label>
                    <div className="control">
                      {this.renderSteps()}
                      <button
                        className="button is-primary"
                        onClick={this.addStep}
                      >
                        Add step
                      </button>
                      <button
                        className="button is-danger"
                        onClick={this.removeStep}
                      >
                        Remove step
                      </button>
                    </div>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.vegetarian}
                        onChange={this.setVegetarian}
                      />{" "}
                      Vegetarian
                    </label>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.gluten}
                        onChange={this.setGluten}
                      />{" "}
                      Gluten
                    </label>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.lactose}
                        onChange={this.setLactose}
                      />{" "}
                      Lactose
                    </label>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.seafood}
                        onChange={this.setSeafood}
                      />{" "}
                      Seafood
                    </label>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={this.state.spicy}
                        onChange={this.setSpicy}
                      />{" "}
                      Spicy
                    </label>
                  </div>
                </form>
              </div>
              <div className="column is-half">
                <div className="container mb-2">
                  Front
                  {this.renderFrontPreview()}
                </div>
                <div className="container">
                  Back
                  {this.renderBackPreview()}
                </div>
                <div className="container mt-4">
                  <button className="button is-primary" onClick={this.download}>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div>
              Milk icon made by{" "}
              <a
                href="https://www.flaticon.com/authors/freepik"
                title="Freepik"
              >
                Freepik
              </a>{" "}
              from{" "}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default App;
