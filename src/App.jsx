import milk from "./milk-bottle.svg";
import * as React from "react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import "./App.css";
import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/js/all.js";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      dpi: 0,
      showMonitorSelector: false,
      brand: "",
      name: "",
      diagonal: "",
      exportWidth: 6, // width of exported pdf in inches
      exportHeight: 3.5, // height of exported pdf in inches
      width: 0, // width of preview in px
      height: 0, // height of preview in px

      title: "",
      description: "",
      prep: "",
      cook: "",
      servings: "",
      ingredients: "",
      steps: [""],
      source: "",
      vegetarian: false,
      gluten: false,
      lactose: false,
      seafood: false,
      spicy: false,
    };

    /*
      For print:

      1) Determine PDF size (ie. 6 x 3.5 inches)
      2) Add 0.125" margin on all sides (color should extend to this boundary, this is the bleed of the print document).
      
      To determine inch to px conversion:
        a) Get DPI of monitor (ie. visit https://dpi.lv/)
        b) 1px = 25.4mm / dpi  (ie. 1px = 25.4mm / 166dpi == 1px = 0.15301 mm)

      2-ctd)
        a) For width. 6 inches + (0.125" * 2) = 6.25". Multiply inches by 25.4 to convert to mm (milimeters).
        6.25 * 25.4 = 158.75mm
        b) For height. 3.5 inches + (0.125" * 2) = 3.75". == 95.25mm
        c) Convert mm to px, this becomes the width/height of your container.
        d) Width = 158.75mm / 0.15301 == 1038px (round up to nearest px)
        e) Height = 95.25mm / 0.15301 == 623px (round up to nearest px)
      3) Add 0.125" padding INSIDE this container, all content should be WITHIN this padding.
      Padding = 0.125" * 25.4mm == 3.175mm.
      3.175mm / 0.15301 == 21px (round up to nearest px)
      Padding becomes 21px.
    */

    this.recipeCardMargin = 3.175; // 0.125in margin on all sides (bleed)
    this.recipeCardWidth = 152.4 + this.recipeCardMargin * 2; // "mm" (jsPDF) unit = 6in
    this.recipeCardHeight = 88.9 + this.recipeCardMargin * 2; // "mm" (jsPDF) unit = 3.5in

    this.monitorList = [
      {
        brand: "ASUS",
        name: "VG248QE",
        diagonal: 24,
      },
    ];

    this.calculateDPI = this.calculateDPI.bind(this);
    this.setShowMonitorSelector = this.setShowMonitorSelector.bind(this);
    this.updateContainers = this.updateContainers.bind(this);

    this.setBrand = this.setBrand.bind(this);
    this.setName = this.setName.bind(this);
    this.setDiagonal = this.setDiagonal.bind(this);
    this.generateBrandOptions = this.generateBrandOptions.bind(this);
    this.generateNameOptions = this.generateNameOptions.bind(this);
    this.generateDiagonalOptions = this.generateDiagonalOptions.bind(this);
    this.setExportHeight = this.setExportHeight.bind(this);
    this.setExportWidth = this.setExportWidth.bind(this);

    this.setTitle = this.setTitle.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setIngredients = this.setIngredients.bind(this);
    this.setPrep = this.setPrep.bind(this);
    this.setCook = this.setCook.bind(this);
    this.setServings = this.setServings.bind(this);
    this.setStep = this.setStep.bind(this);
    this.addStep = this.addStep.bind(this);
    this.removeStep = this.removeStep.bind(this);
    this.setSource = this.setSource.bind(this);
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

  // Based off of code from https://dpi.lv/
  calculateDPI() {    
    const dppx =
      window.devicePixelRatio ||
      (window.matchMedia &&
      window.matchMedia(
        "(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)"
      ).matches
        ? 2
        : 1) ||
      1;

    const width = window.screen.width * dppx;
    const height = window.screen.height * dppx;
    const c = Math.sqrt(width * width + height * height);
    const dpi = Math.ceil((c / this.monitorList[0].diagonal) * 10) / 10;
    return dpi;
  }

  setShowMonitorSelector(event) {
    const checked = event.target.checked;
    this.setState({
      showMonitorSelector: checked,
    });
  }

  // Updates preview windows of the cards based on the size
  // of the exported file
  updateContainers(newValue){
    if (isNaN(parseFloat(newValue))){
      return;
    }

    // dynamic calc size
    const p = 25.4 / this.state.dpi;
    const w = Math.round(((parseFloat(this.state.exportWidth) + 0.125 * 2) * 25.4) / p);
    const h = Math.round(((parseFloat(this.state.exportHeight) + 0.125 * 2) * 25.4) / p);

    this.setState({
      width: w,
      height: h,
    });
  }

  setBrand(event) {
    const value = event.target.value;
    this.setState({
      brand: value,
      name: "",
      diagonal: "",
    });
  }

  setName(event) {
    const value = event.target.value;
    this.setState({
      name: value,
      diagonal: "",
    });
  }

  setDiagonal(event) {
    const value = event.target.value;

    this.setState({
      diagonal: value,
      dpi: this.calculateDPI()
    }, () => this.updateContainers(1));
  }

  generateBrandOptions() {
    let brands = this.monitorList.map((m, i) => (
      <option key={i} value={m.brand}>
        {m.brand}
      </option>
    ));
    brands.unshift(
      <option key={-1} value="">
        Select a brand
      </option>
    );

    return brands;
  }

  generateNameOptions() {
    let names = this.monitorList
      .filter((m) => m.brand === this.state.brand)
      .map((m, i) => (
        <option key={i} value={m.name}>
          {m.name}
        </option>
      ));

    names.unshift(
      <option key={-1} value="">
        Select a name
      </option>
    );

    return names;
  }

  generateDiagonalOptions() {
    let diagonals = this.monitorList
      .filter((m) => m.brand === this.state.brand && m.name === this.state.name)
      .map((m, i) => (
        <option key={i} value={m.diagonal}>
          {m.diagonal}
        </option>
      ));

    diagonals.unshift(
      <option key={-1} value="0">
        Select a diagonal
      </option>
    );

    return diagonals;
  }

  setExportHeight(event) {  
    const value = event.target.value;

    this.setState({
      exportHeight: value,
    }, () => this.updateContainers(value));
  }

  setExportWidth(event) {
    const value = event.target.value;

    this.setState({
      exportWidth: value,
    }, () => this.updateContainers(value));   
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

  setSource(event) {
    const value = event.target.value;
    this.setState({
      source: value,
    });
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

  // Do not scale zoom on page or else the output will be messed up
  download(event) {
    const _ = this;
    const width = _.state.width * (25.4 / _.state.dpi); // convert px to mm
    const height = _.state.height * (25.4 / _.state.dpi); // convert px to mm

    toPng(document.getElementById("js-front"), {})
      .then(function (frontImgData) {
        toPng(document.getElementById("js-back"))
          .then(function (backImgData) {
            const newPDF = new jsPDF({
              orientation: "landscape",
              format: [width, height],
              compress: true,
            });
            newPDF.addImage(frontImgData, "PNG", 0, 0, width, height);
            newPDF.addPage([width, height], "landscape");
            newPDF.setPage(2);
            newPDF.addImage(backImgData, "PNG", 0, 0, width, height);

            newPDF.save(
              `${_.state.title ? _.state.title : "Blank"} - RecipeCard.pdf`
            );
          })
          .catch(function (error) {
            console.error("Failed to save back of recipe card to PNG.");
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error("Failed to save front of recipe card to PNG.");
        console.error(error);
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
      <div
        className="container card-preview"
        id="js-front"
        style={{
          width: this.state.width * 2 + "px",
          height: this.state.height * 2 + "px",
        }}
      >
        <section
          className="hero is-info"
          style={{ padding: "47px 47px 0px 47px" }}
        >
          <div className="hero-body pb-4">
            <div className="container">
              <h3 className="title is-3">{this.state.title}</h3>
            </div>
          </div>
        </section>
        <section
          className="section pt-2"
          style={{
            paddingLeft: "47px",
            paddingRight: "47px",
            paddingBottom: "47px",
          }}
        >
          <div className="container">
            <div className="columns">
              <div className="column is-two-fifths">
                <h4
                  className="title is-4 mb-4 pb-1"
                  style={{ borderBottom: "2px solid #363636" }}
                >
                  Ingredients
                </h4>
                <div type="1" className="pl-4">
                  {this.state.ingredients
                    .split("\n")
                    .map((value, index, array) => {
                      return <div key={index}>{value}</div>;
                    })}
                </div>
              </div>
              <div className="column is-three-fifths">
                <h4
                  className="title is-4 mb-4 pb-1"
                  style={{ borderBottom: "2px solid #363636" }}
                >
                  Steps
                </h4>
                <ol type="1" className="pl-6">
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
      <div
        className="container card-preview"
        id="js-back"
        style={{
          width: this.state.width * 2 + "px",
          height: this.state.height * 2 + "px",
        }}
      >
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
            <span className="icon ml-5">
              <i className="fas fa-leaf fa-2x"></i>
            </span>
          ) : null}
          {this.state.gluten ? (
            <span className="icon ml-5">
              <i className="fas fa-bread-slice fa-2x"></i>
            </span>
          ) : null}
          {this.state.lactose ? (
            <span className="icon ml-5">
              <img src={milk} alt="Milk jug" />
            </span>
          ) : null}
          {this.state.seafood ? (
            <span className="icon ml-5">
              <i className="fas fa-fish fa-2x"></i>
            </span>
          ) : null}
          {this.state.spicy ? (
            <span className="icon ml-5">
              <i className="fas fa-pepper-hot fa-2x"></i>
            </span>
          ) : null}
        </div>
        <div className="tiled-info pl-4 pb-2">
          <div className="pt-2">
            <span className="times pr-5">{this.state.prep}</span>
            <span className="icon is-left">
              <i className="fas fa-hands fa-2x"></i>
            </span>
          </div>
          <div className="pt-2">
            <span className="times pr-5">{this.state.cook}</span>
            <span className="icon is-left">
              <i className="fas fa-fire fa-2x"></i>
            </span>
          </div>
          <div className="pt-2">
            <span className="times pr-5">{this.state.servings}</span>
            <span className="icon is-left">
              <i className="fas fa-utensils fa-2x"></i>
            </span>
          </div>
        </div>
        <div className="recipe-source">{this.state.source}</div>
        <div className="built-by">
          Built by: https://github.com/reZach/recipe-cards
        </div>
      </div>
    );
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
        <section className="section">
          <div className="container">
            <h1 className="title">Instructions (BETA)</h1>
            <p>
              Ensure your screen resolution is 1920 x 1080.
              <br />
              Ensure you are at 100% zoom on this webpage.
              <br />
              Enter in your recipe details and click the{" "}
              <strong>Download</strong> button below.
              <br />
              (Optional) Take the resulting PDF to{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://smartpress.com/offering/collated-printing"
              >
                https://smartpress.com/offering/collated-printing
              </a>
              .<br />
              (Optional) Change Sheets Per Set to <strong>2</strong>.<br />
              (Optional) Change Total Number of Sets to <strong>1</strong>.
              <br />
              (Optional) Choose an unfolded size of <strong>
                6"
              </strong> width, <strong>3.5"</strong> height.
              <br />
              (Optional) Choose <strong>Full Color</strong> for Printing on
              Back.
              <br />
              (Optional) Choose any other options you'd like, then place an
              order.
              <br />
              (Optional) Order will consist of 2 of the same printed recipe
              card.
            </p>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <form>
              <div className="field">
                <div className="control">
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      defaultChecked={this.state.showMonitorSelector}
                      onClick={this.setShowMonitorSelector}
                    />{" "}
                    Show monitor options
                  </label>
                </div>
              </div>
              {this.state.showMonitorSelector ? (
                <React.Fragment>
                  <div className="field">
                    <label className="label">Brand</label>
                    <div className="control">
                      <div className="select">
                        <select
                          onChange={this.setBrand}
                          value={this.state.brand}
                        >
                          {this.generateBrandOptions()}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Name</label>
                    <div className="control">
                      <div className="select">
                        <select
                          onChange={this.setName}
                          value={this.state.name}
                          disabled={this.state.brand === ""}
                        >
                          {this.generateNameOptions()}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">Diagonal</label>
                    <div className="control">
                      <div className="select">
                        <select
                          onChange={this.setDiagonal}
                          value={this.state.diagonal}
                          disabled={this.state.name === ""}
                        >
                          {this.generateDiagonalOptions()}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label className="label">
                      Screen DPI: {this.state.dpi}
                    </label>
                  </div>
                </React.Fragment>
              ) : null}
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
                  <button className="button is-primary" onClick={this.addStep}>
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
                <label className="label">Source</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="Source of recipe"
                    value={this.state.source}
                    onChange={this.setSource}
                  />
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
        </section>
        <section className="section">
          <div className="container mb-2">
            <h2 className="title is-2">Preview</h2>
            <form>
              <div className="field">
                <label className="label">Card size (width" by height")</label>
              </div>
              <div className="field is-horizontal">
                <div className="field-body">
                  <div className="field">
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        placeholder="Width"
                        value={this.state.exportWidth}
                        onChange={this.setExportWidth}
                      />
                    </p>
                  </div>
                  <div className="field">
                    <p className="control is-expanded">
                      <input
                        className="input"
                        type="text"
                        placeholder="Height"
                        value={this.state.exportHeight}
                        onChange={this.setExportHeight}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
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
          <div className="mt-4">
            Milk icon made by{" "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{" "}
            from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

export default App;
