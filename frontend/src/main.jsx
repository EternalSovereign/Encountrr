import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    success: {
                        style: {
                            background: "#D1FAE5", // green-100
                            color: "#065F46", // green-800
                            border: "1px solid #10B981", // green-500
                            fontWeight: 500,
                        },
                        iconTheme: {
                            primary: "#10B981",
                            secondary: "#ECFDF5",
                        },
                    },
                    error: {
                        style: {
                            background: "#FEE2E2", // red-100
                            color: "#991B1B", // red-800
                            border: "1px solid #EF4444",
                            fontWeight: 500,
                        },
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#FEF2F2",
                        },
                    },
                }}
            />
        </Provider>
    </React.StrictMode>
);
