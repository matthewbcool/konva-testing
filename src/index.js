import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Transformer } from "react-konva";

class Rectangle extends React.Component {
  render() {
    return (
      <Rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.fill}
        name={this.props.name}
        draggable
      />
    );
  }
}

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }
  componentDidUpdate() {
    this.checkNode();
  }
  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const { selectedShapeName } = this.props;

    const selectedNode = stage.findOne("." + selectedShapeName);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }
  render() {
    return (
      <Transformer
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class App extends Component {
  state = {
    mousePos: "",
    rectangles: [
      {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        fill: "red",
        name: "rect1"
      },
      {
        x: 150,
        y: 150,
        width: 100,
        height: 100,
        fill: "green",
        name: "rect2"
      }
    ],
    selectedShapeName: ""
  };

  drawNewRec = (xPos, yPos) => {
    const fillColors = [
      "purple",
      "blue",
      "orange",
      "yellow",
      "black",
      "red",
      "green"
    ];
    let randomColor = fillColors[Math.floor(Math.random() * 6)];
    //make a unique name for the rec
    let setName = () => {
      let numOfRecs = this.state.rectangles.length + 1;
      return "rect" + numOfRecs;
    };

    this.setState({
      rectangles: [
        ...this.state.rectangles,
        {
          x: xPos,
          y: yPos,
          width: 100,
          height: 100,
          fill: randomColor,
          name: setName()
        }
      ]
    });
    //later we can make its x/y position will be the mouse x/y position onMouseDown
  };

  createRec = e => {
    this.setState({
      mousePos: "x:" + e.target.pointerPos.x + " y: " + e.target.pointerPos.y
    });
    this.drawNewRec(e.target.pointerPos.x, e.target.pointerPos.y);
  };

  handleStageMouseDown = e => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ""
      });
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === "Transformer";
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    const rect = this.state.rectangles.find(r => r.name === name);
    if (rect) {
      this.setState({
        selectedShapeName: name
      });
    } else {
      this.setState({
        selectedShapeName: ""
      });
    }
  };
  render() {
    return (
      <div>
        <h3>
          Click below this heading to draw a rectangle Rect at:{" "}
          {this.state.mousePos}
        </h3>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={this.handleStageMouseDown}
          onClick={this.createRec}
        >
          <Layer>
            {this.state.rectangles.map((rect, i) => (
              <Rectangle key={i} {...rect} />
            ))}
            <TransformerComponent
              selectedShapeName={this.state.selectedShapeName}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
