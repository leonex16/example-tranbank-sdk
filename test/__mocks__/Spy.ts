export abstract class Spy {
  public methodCalledCounter = 0;

  clearSpy () {
    this.methodCalledCounter = 0;
  }
}
