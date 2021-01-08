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
      ingredients: "",
      steps: [""],
    };

    this.setTitle = this.setTitle.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setIngredients = this.setIngredients.bind(this);
    this.setStep = this.setStep.bind(this);
    this.addStep = this.addStep.bind(this);
    this.removeStep = this.removeStep.bind(this);
    this.renderSteps = this.renderSteps.bind(this);
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

  setStep(event) {
    const value = event.target.value;

    this.setState({
      description: value,
    });
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
            <textarea class="textarea" value={this.state.steps[i]}></textarea>
          </div>
        </div>
      );
    }

    return steps;
  }

  render() {
    return (
      <React.Fragment>
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
                <div className="container">Preview</div>
                <div className="container card-preview">
                  <section className="hero is-primary">
                    <div className="hero-body">
                      <div className="container">
                        <h1 className="title">{this.state.title}</h1>
                        <h2 className="subtitle">{this.state.description}</h2>
                      </div>
                    </div>
                  </section>
                  {this.state.steps.forEach((value, index, array) => {
                    return (
                      <section>
                        <div className="container">
                          <div className="container">
                            <text>{value}</text>
                          </div>
                        </div>
                      </section>
                    );
                  })}
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
