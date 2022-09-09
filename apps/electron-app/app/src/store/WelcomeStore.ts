import { makeAutoObservable } from "mobx";

export class WelcomeStore {
  step: number = -1;

  constructor() {
    makeAutoObservable(this);

    // window.localStorage.removeItem("welcome");

    const stepStr = JSON.parse(window.localStorage.getItem("welcome") || "0");

    try {
      this.step = parseInt(stepStr);
    } catch (err) {
      this.step = 0;
    }
  }

  setStep = (step: number, save = true) => {
    this.step = step;
    if (save) {
      this.saveLayout();
    }
  };

  finish = () => {
    this.setStep(7);
  };

  quietFinish = () => {
    const alreadyQuietlyFinished = window.localStorage.getItem(
      "alreadyQuietlyFinished"
    );

    this.setStep(7, !!alreadyQuietlyFinished);

    window.localStorage.setItem("alreadyQuietlyFinished", "true");
  };

  get displayWelcome() {
    return this.step !== -1 && this.step < 7;
  }

  saveLayout = () => {
    window.localStorage.setItem("welcome", this.step + "");
  };
}
