import { Component } from "@eva/eva.js";

export class Attribute extends Component {
  static componentName = 'Attribute'
  constructor(public force: number) {
    super();
  }
}