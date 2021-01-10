import logo from "./logo.svg";
import * as React from "react";
import "./App.css";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/js/all.js";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      prep: null,
      cook: null,
      servings: null,
      ingredients: "",
      steps: [""],
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

  setPrep(event){
    const value = event.target.value;
    this.setState({
      prep: value,
    });
  }

  setCook(event){
    const value = event.target.value;
    this.setState({
      cook: value,
    });
  }

  setServings(event){
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

  renderSteps() {
    let steps = [];

    for (let i = 0; i < this.state.steps.length; i++) {
      steps.push(
        <div class="field">
          <label class="label">{i + 1}</label>
          <div class="control">
            <textarea
              class="textarea"
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
      <div className="container card-preview">
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
                <h4 className="title is-4 mb-4">Ingredients</h4>
                {this.state.ingredients.split("\n").map((ingredient, index) => {
                  return <div key={index}>{ingredient}</div>;
                })}
              </div>
              <div className="column is-three-fifths">
                <h4 className="title is-4 mb-4">Steps</h4>
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
      <div className="container card-preview">
        <section class="hero is-info is-fullheight">
          <div class="hero-body">
            <div class="container">
              <h1 class="title has-text-centered">{this.state.title}</h1>
              <h2 class="subtitle has-text-centered">
                {this.state.description}
              </h2>
            </div>
          </div>
        </section>
        <div className="tiled-info">
          <div>
            {this.state.prep}
            <span class="icon is-left">
              <i class="fas fa-hands"></i>
            </span>
          </div>
          <div>
            {this.state.cook}
            <span class="icon is-left">
              <i class="fas fa-temperature-high"></i>
            </span>
          </div>
          <div>
            {this.state.servings}
            <span class="icon is-left">
              <i class="fas fa-utensils"></i>
            </span>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <nav class="navbar" role="navigation" aria-label="main navigation">
          <div class="navbar-brand">
            <a class="navbar-item" href="/">
              <img
                src="https://bulma.io/images/bulma-logo.png"
                width="112"
                height="28"
              />
            </a>

            <a
              role="button"
              class="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" class="navbar-menu">
            <div class="navbar-start">
              <a class="navbar-item">Home</a>

              <a class="navbar-item">Documentation</a>

              <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">More</a>

                <div class="navbar-dropdown">
                  <a class="navbar-item">About</a>
                  <a class="navbar-item">Jobs</a>
                  <a class="navbar-item">Contact</a>
                  <hr class="navbar-divider" />
                  <a class="navbar-item">Report an issue</a>
                </div>
              </div>
            </div>

            <div class="navbar-end">
              <div class="navbar-item">
                <div class="buttons">
                  <a class="button is-primary">
                    <strong>Sign up</strong>
                  </a>
                  <a class="button is-light">Log in</a>
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
                        autofocus="true"
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
                  <div class="field is-horizontal">
                    <div class="field-body">
                      <div class="field">
                        <p class="control is-expanded">
                          <input
                            class="input"
                            type="text"
                            placeholder="Prep time"
                            value={this.state.prep}
                            onChange={this.setPrep}
                          />
                        </p>
                      </div>
                      <div class="field">
                        <p class="control is-expanded">
                          <input
                            class="input"
                            type="text"
                            placeholder="Cook time"
                            value={this.state.cook}
                            onChange={this.setCook}
                          />
                        </p>
                      </div>
                      <div class="field">
                        <p class="control is-expanded">
                          <input
                            class="input"
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
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default App;
