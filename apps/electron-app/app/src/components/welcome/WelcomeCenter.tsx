import React from "react";
import { AnnotationContext, Hotspot } from "@cloudscape-design/components";
import { observer } from "mobx-react-lite";
import { useStores } from "../../store";
import "./WelcomeCenter.css";

export default observer(() => {
  const { welcome } = useStores();

  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const divRef = React.useCallback((node: HTMLDivElement) => {
    if (!node) return;

    setSize({
      width: node.getBoundingClientRect().width,
      height: node.getBoundingClientRect().height,
    });
  }, []);

  if (!welcome.displayWelcome) return null;

  const center = {
    left: size.width * 0.5,
    top: size.height * 0.5,
  };
  const topLeft = {
    top: 50,
    left: 50,
  };
  const topLeftPlusIndex = (index: number) => ({
    ...topLeft,
    top: topLeft.top + index * 50,
  });

  const locations = [
    center,
    center,
    topLeft,
    topLeftPlusIndex(1),
    topLeftPlusIndex(2),
    topLeftPlusIndex(3),
    center,
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        background: "rgba(255,255,255,0.4)",
      }}
      className="welcome-tutorial"
      ref={divRef}
      onClick={welcome.finish}>
      <div onClick={(e) => e.stopPropagation()}>
        <AnnotationContext
          onExitTutorial={() => {
            window.alert("On exit");
            welcome.finish();
          }}
          onFinish={() => {
            welcome.finish();
          }}
          onStartTutorial={() => {}}
          onStepChange={(evt) => {
            console.log("evt");
            welcome.setStep(evt.detail.step);
          }}
          currentTutorial={{
            completed: false,
            description: "Welcome to Cloud Canvas",
            completedScreenDescription: "All done, let's get building!",
            title: "",
            tasks: [
              {
                title: "Welcome to Cloud Canvas",
                steps: [
                  {
                    title: "Playfully secure",
                    content: (
                      <>
                        <div>
                          Hi there 👋 . I hear you've been having a boring old
                          time in the AWS console. Log in. View a resource.
                          Switch account. Lose access to old resource. Yawn 🥱
                          {"\n\n"}
                        </div>
                        <br />
                        <div>Wouldn't it be amazing if...</div>
                      </>
                    ),
                    hotspotId: "welcome-1",
                  },
                  {
                    title: "Delightful",
                    content: (
                      <>
                        <div>
                          ...you could create your own interactive AWS console
                          across accounts and lay it however you like 🤯!?
                        </div>
                        <br />
                        <div>
                          Cloud Canvas is just that. Here you can create
                          components on an infinite canvas that streams updates
                          in real time. Nice eh 😍!?
                        </div>
                      </>
                    ),
                    hotspotId: "welcome-2",
                  },
                  {
                    title: "All the accounts",
                    content: (
                      <>
                        <div>
                          You can use accounts from all of the organisations you
                          have SSO access to. All under one happy home.
                        </div>
                        <br />
                        <div>
                          On startup we picked up your intial config from{" "}
                          <code>~/.aws/config</code> and cloned it to{" "}
                          <code>~/.cloudcanvas/cache/access.json</code>.
                        </div>
                      </>
                    ),
                    hotspotId: "welcome-3",
                  },
                  {
                    title: "Add organisations",
                    content: (
                      <>
                        <div>
                          You can add new organisations here or delete ones you
                          don't want Cloud Canvas to manage.
                        </div>
                        <br />
                        <div>
                          We only update our own cache file meaning your{" "}
                          <code>/.aws/config</code> file remains the same.
                        </div>
                      </>
                    ),
                    hotspotId: "welcome-4",
                  },
                  {
                    title: "Secure by design",
                    content: (
                      <>
                        <div>
                          We integrate with AWS tools directly and use their
                          best practices for refreshing and securing your
                          credentials locally.
                        </div>
                        <br />
                        <div>
                          Sessions created here are saved in{" "}
                          <code>/.aws/sso/cache</code>, directly integrating
                          with the AWS CLI!
                        </div>
                      </>
                    ),
                    hotspotId: "welcome-5",
                  },
                  {
                    title: "Global visibility",
                    content: (
                      <>
                        <div>
                          When you have a valid session (saved in your{" "}
                          <code>/.aws/sso/cache</code>) the organisation will be
                          coloured green and components using it can stream
                          updates.
                        </div>
                        <br />
                        <div>
                          You can easily refresh your session from here by
                          clicking your organisation and then "Authorise".
                        </div>
                      </>
                    ),
                    hotspotId: "welcome-6",
                  },

                  {
                    title: "Let's get building",
                    content: (
                      <>
                        <div>
                          Anyway that's enough for now. Hit Finish and then hit
                          CMD+K or right click the canvas to create your first
                          component!
                        </div>
                        <br />
                        <div>We hope you're excited as we are 🤩!</div>
                      </>
                    ),
                    hotspotId: "welcome-7",
                  },
                ],
              },
            ],
          }}
          i18nStrings={{
            stepCounterText: (stepIndex, totalStepCount) =>
              "Step " + (stepIndex + 1) + "/" + totalStepCount,
            taskTitle: (_taskIndex, taskTitle) => taskTitle,
            labelHotspot: (openState) =>
              openState ? "close annotation" : "open annotation",
            nextButtonText: "Next",
            previousButtonText: "Previous",
            finishButtonText: "Finish",
            labelDismissAnnotation: "dismiss annotation",
          }}>
          {locations.map((location, index) => (
            <div
              style={{
                position: "absolute",
                left: location.left,
                top: location.top,
                background: "transparent",
              }}>
              <Hotspot side="right" hotspotId={`welcome-${index + 1}`}>
                <div
                  style={{
                    width: 1,
                    height: 1,
                    background: "transparent",
                  }}
                />
              </Hotspot>
            </div>
          ))}
        </AnnotationContext>
      </div>
    </div>
  );
});
