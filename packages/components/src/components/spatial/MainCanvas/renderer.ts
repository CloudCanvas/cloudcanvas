type Origin = { originX: number; originY: number };
type Transformation = {
  originX: number;
  originY: number;
  translateX: number;
  translateY: number;
  scale: number;
};

type State = {
  transformation: Transformation;
  element: HTMLElement;
};

type ZoomState = {
  initialScale?: number;
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
};

const hasPositionChanged = ({
  pos,
  prevPos,
}: {
  pos: number;
  prevPos: number;
}) => pos !== prevPos;

const valueInRange = ({
  minScale,
  maxScale,
  scale,
}: {
  minScale: number;
  maxScale: number;
  scale: number;
}) => scale <= maxScale && scale >= minScale;

const getTranslate =
  ({
    minScale,
    maxScale,
    scale,
  }: {
    minScale: number;
    maxScale: number;
    scale: number;
  }) =>
  ({
    pos,
    prevPos,
    translate,
  }: {
    pos: number;
    prevPos: number;
    translate: number;
  }) =>
    valueInRange({ minScale, maxScale, scale }) &&
    hasPositionChanged({ pos, prevPos })
      ? translate + (pos - prevPos * scale) * (1 - 1 / scale)
      : translate;

const getMatrix = ({
  scale,
  translateX,
  translateY,
}: {
  translateX: number;
  translateY: number;
  scale: number;
}) => `matrix(${scale}, 0, 0, ${scale}, ${translateX}, ${translateY})`;

const getScale = ({
  scale,
  minScale,
  maxScale,
  scaleSensitivity,
  deltaScale,
}: {
  scale: number;
  minScale: number;
  maxScale: number;
  scaleSensitivity: number;
  deltaScale: number;
}) => {
  let newScale = scale + deltaScale / (scaleSensitivity / scale);
  newScale = Math.max(minScale, Math.min(newScale, maxScale));
  return [scale, newScale];
};

const pan = ({
  state,
  originX,
  originY,
}: {
  state: State;
  originX: number;
  originY: number;
}) => {
  state.transformation.translateX += originX;
  state.transformation.translateY += originY;
  state.element.style.transform = getMatrix({
    scale: state.transformation.scale,
    translateX: state.transformation.translateX,
    translateY: state.transformation.translateY,
  });
};

const canPan = (state: State) => ({
  panBy: ({ originX, originY }: Origin) => pan({ state, originX, originY }),
  panTo: ({ originX, originY, scale }: Origin & { scale: number }) => {
    state.transformation.scale = scale;
    pan({
      state,
      originX: originX - state.transformation.translateX,
      originY: originY - state.transformation.translateY,
    });
  },
});

const canZoom = (state: ZoomState & State) => ({
  zoom: ({ x, y, deltaScale }: any) => {
    const { left, top } = state.element.getBoundingClientRect();
    const { minScale, maxScale, scaleSensitivity } = state;
    const [scale, newScale] = getScale({
      scale: state.transformation.scale,
      deltaScale,
      minScale,
      maxScale,
      scaleSensitivity,
    });
    const originX = x - left;
    const originY = y - top;
    const newOriginX = originX / scale;
    const newOriginY = originY / scale;
    const translate = getTranslate({ scale, minScale, maxScale });
    const translateX = translate({
      pos: originX,
      prevPos: state.transformation.originX,
      translate: state.transformation.translateX,
    });
    const translateY = translate({
      pos: originY,
      prevPos: state.transformation.originY,
      translate: state.transformation.translateY,
    });

    state.element.style.transformOrigin = `${newOriginX}px ${newOriginY}px`;
    state.element.style.transform = getMatrix({
      scale: newScale,
      translateX,
      translateY,
    });
    state.transformation = {
      originX: newOriginX,
      originY: newOriginY,
      translateX,
      translateY,
      scale: newScale,
    };
  },
});

const handler = ({
  minScale,
  maxScale,
  element,
  initialScale,
  scaleSensitivity = 10,
}: ZoomState & Omit<State, "transformation">) => {
  const state = {
    element,
    minScale,
    maxScale,
    scaleSensitivity,
    transformation: {
      originX: 0,
      originY: 0,
      translateX: 0,
      translateY: 0,
      scale: initialScale || 1,
    },
  };
  return Object.assign({}, canZoom(state), canPan(state), {
    getState: () => state,
  });
};

export type ZoomRenderer = ReturnType<typeof handler>;

export default handler;
