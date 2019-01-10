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
    prevX: "",
    prevY: "",
    rectangles: [],
    selectedShapeName: ""
  };

  drawNewRec = (prevX, prevY, xPos, yPos) => {
    const fillColors = [
      "purple",
      "blue",
      "orange",
      "yellow",
      "black",
      "red",
      "green"
    ];
    let randomColor = fillColors[Math.floor(Math.random() * 7)];
    //make a unique name for the rect
    let setName = () => {
      let numOfRecs = this.state.rectangles.length + 1;
      return "rect" + numOfRecs;
    };

    this.setState({
      rectangles: [
        ...this.state.rectangles,
        {
          x: prevX - (prevX - xPos),
          y: prevY - (prevY - yPos),
          width: prevX - xPos,
          height: prevY - yPos,
          fill: randomColor,
          name: setName()
        }
      ]
    });
  };

  handleStageMouseDown = e => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        prevX: e.target.pointerPos.x,
        prevY: e.target.pointerPos.y,
        mousePos: "CLICK N DRAG TO MAKE A SHAPE"
      });
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
  handleStageMouseUp = e => {
    let xPos = e.target.pointerPos.x;
    let yPos = e.target.pointerPos.y;
    let prevX = this.state.prevX;
    let prevY = this.state.prevY;
    console.log(xPos, yPos, prevX, prevY);
    this.setState({
      mousePos: "x:" + xPos + " y: " + yPos
    });
    this.drawNewRec(prevX, prevY, xPos, yPos);
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
          onMouseUp={this.handleStageMouseUp}
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
