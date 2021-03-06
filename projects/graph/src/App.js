import React, { Component } from 'react';
import { Graph } from './graph';
import './App.css';

// imports for jsdoc/intellisense
import { Vertex, Edge } from './graph'; 

const xCount = 8;
const yCount = 8;
const boxSize = 150;

const canvasWidth = boxSize * xCount;
const canvasHeight = boxSize * yCount;
const vertexRadius = boxSize / 8;
/**
 * GraphView
 * @extends {Component<{graph: Graph}, State>}
 * 
 */
class GraphView extends Component {
  constructor() {
    super();
  }
  /**
   * On mount
   */
  componentDidMount() {
    this.updateCanvas();
  }

  /**
   * On state update
   */
  componentDidUpdate() {
    this.updateCanvas();
  }

  /**
   * Renders all edges of a given vertex.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Vertex} parentVertex
   */
  drawEdges(ctx, parentVertex) {
    for (const edge of parentVertex.edges) {
      ctx.moveTo(parentVertex.pos.x, parentVertex.pos.y);
      ctx.lineTo(edge.destination.pos.x, edge.destination.pos.y);
      ctx.stroke();
    }
  }

  /**
   * Renders a single vertex with its text centered.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Vertex} vertex
   */
  drawVertex(ctx, vertex) {
    ctx.moveTo(vertex.pos.x, vertex.pos.y);
    ctx.beginPath();
    ctx.arc(vertex.pos.x, vertex.pos.y, vertexRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = vertex.color;
    ctx.fill();
    ctx.stroke();

    // add text to middle of node
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.font = '10px Arial';
    ctx.textBaseline = 'middle';
    ctx.fillText(vertex.value, vertex.pos.x, vertex.pos.y);
  }

  /**
   * Render the canvas
   */
  updateCanvas() {
    /** @type {CanvasRenderingContext2D} */
    let ctx = this.refs.canvas.getContext('2d');

    // initialize canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (const vertex of this.props.graph.vertexes) {
      this.drawEdges(ctx, vertex);
      this.drawVertex(ctx, vertex);
    }

  }
  
  /**
   * Render
   */
  render() {
    return <canvas ref="canvas" width={canvasWidth} height={canvasHeight}></canvas>;
  }
}


/**
 * App
 */
class App extends Component {
  state = {
    graph: new Graph()
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.randomize();
  }

  randomize = () => {
    const graph = new Graph();
    graph.randomize(xCount, yCount, boxSize);
    for (const vertex of graph.vertexes) {
      if (!vertex.color) { // no color == not touched
        graph.bfs(vertex);
      }
    }
    this.setState({ graph });
  }

  render() {
    return (
      <div className="App">
        <GraphView graph={this.state.graph}></GraphView>
        <br />
        <button onClick={this.randomize}>Randomize</button>
      </div>
    );
  }
}

export default App;
