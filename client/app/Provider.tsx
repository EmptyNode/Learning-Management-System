import React from "react";
import {Provider} from "react-redux";
import {store} from "../redux/store";

interface ProviderPros {
    children: any;
}

export function Providers({children}: ProviderPros) {
    return <Provider store={store}>{children}</Provider>
}
