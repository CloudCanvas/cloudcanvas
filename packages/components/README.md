# CloudCanvas components

This package contains a storyboard of all components that can be leveraged to construct a cloud canvas.

These can be used in desktop or web apps but primarily focused on desktop for security reasons at present.

## Creating a new component

Components can be developed in isolation through storybook (well, ladle) and a library for fetching the data you require.

The folder structure for a component under `components/aws` is

```
controller.ts       ->  this file handles fetching data from AWS)
catalog.ts          ->  catalog details for preview & display
model.ts            ->  this file stores all dynamic data from AWS for rendering
sampleData.ts       ->  this file stores a sample of data and a sample update for the preview panel
view.tsx            ->  this file stores the presentation layer, the entrypoint of your component
view.stories.tsx    ->  story files for your view
view.css            ->  styling

```

You should also add your component to the `componentCatalog` in `domain/components.ts`.

And the final step at present is to add the required data to be collected into the `addResource.ts` component. We plan on moving this to the catalog as an array of actions to be taken in future.

## Improvements

Right now the view takes in the AWS client and does the data fetching, making it hard to mock. Still trying to figure out the best way to design this but for now I recommend that you split your `"view.ts"` file into a React component as entrypoint that takes the props and does the data fetching and then passes the data to another component which handles the presentation based on the model.

This lets you easily model story files.

i.e.

`view.ts`

```
import React from 'react';
import Model from '../model/model.ts';

...
export default function ViewEntry(props: Props) {
    const { awsClient } = props;
    const [model, setModel] = React.useState<Model | undefined>(undefined);
    const controller = useMemo(() => {
        return new Controller(awsClient);
    }, [])

    // Use the awsClient to fetch model dat
    useEffect(() => {
        controller.fetchModel().then(setModel);
    }, []);

    return <div>
        <h1>Hello World</h1>
        <p>{data.hello}</p>
    </div>
}

// This is the file you use for storyboards
export const View = ({model}: {model: Model}) => {
    return (
        <div>
            {/* Presentation layer goes here */}
        </div>
    )
}
```

You can always break your View up however you see fit and storyboard them.
