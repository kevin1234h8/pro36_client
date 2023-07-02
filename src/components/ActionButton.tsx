import React from "react";
import "../scss/actionbutton.css";
const ActionButton = () => {
  return (
    <div className="relative ml-24">
      <button
        className="relative z-10 flex p-2 bg-white border rounded-md opacity-50 sharebtn hover:opacity-100 focus:outline-none focus:border-blue-400"
        title="click to enable menu"
      >
        <span className="inline-block pr-4 text-gray-600">Share</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="w-6 h-5 my-1 text-blue-700"
        >
          <path
            fill="currentColor"
            d="M352 320c-22.608 0-43.387 7.819-59.79 20.895l-102.486-64.054a96.551 96.551 0 0 0 0-41.683l102.486-64.054C308.613 184.181 329.392 192 352 192c53.019 0 96-42.981 96-96S405.019 0 352 0s-96 42.981-96 96c0 7.158.79 14.13 2.276 20.841L155.79 180.895C139.387 167.819 118.608 160 96 160c-53.019 0-96 42.981-96 96s42.981 96 96 96c22.608 0 43.387-7.819 59.79-20.895l102.486 64.054A96.301 96.301 0 0 0 256 416c0 53.019 42.981 96 96 96s96-42.981 96-96-42.981-96-96-96z"
          ></path>
        </svg>
      </button>
      <div className="absolute right-0 z-20 hidden w-48 mt-0 overflow-hidden bg-white border border-gray-100 rounded-sm shadow-lg sharebtn-dropdown">
        <a
          href="#"
          title="Share on Facebook (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="facebook-messenger"
            className="w-5 h-5 mr-4 text-blue-500"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              fill="currentColor"
              d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z"
            ></path>
          </svg>
          <span className="text-gray-600">Facebook</span>
        </a>
        <a
          href="#"
          title="Share on Twitter (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="twitter-square"
            className="w-5 h-5 mr-4 text-blue-500"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-48.9 158.8c.2 2.8.2 5.7.2 8.5 0 86.7-66 186.6-186.6 186.6-37.2 0-71.7-10.8-100.7-29.4 5.3.6 10.4.8 15.8.8 30.7 0 58.9-10.4 81.4-28-28.8-.6-53-19.5-61.3-45.5 10.1 1.5 19.2 1.5 29.6-1.2-30-6.1-52.5-32.5-52.5-64.4v-.8c8.7 4.9 18.9 7.9 29.6 8.3a65.447 65.447 0 0 1-29.2-54.6c0-12.2 3.2-23.4 8.9-33.1 32.3 39.8 80.8 65.8 135.2 68.6-9.3-44.5 24-80.6 64-80.6 18.9 0 35.9 7.9 47.9 20.7 14.8-2.8 29-8.3 41.6-15.8-4.9 15.2-15.2 28-28.8 36.1 13.2-1.4 26-5.1 37.8-10.2-8.9 13.1-20.1 24.7-32.9 34z"
            ></path>
          </svg>
          <span className="text-gray-600">Twitter</span>
        </a>
        <a
          href="#"
          title="Share on LinkedIn (NB! does not work in this demo)"
          className="flex px-4 py-2 text-sm text-gray-800 border-b hover:bg-blue-100"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="linkedin"
            className="w-5 h-5 mr-4 text-blue-500"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
            ></path>
          </svg>
          <span className="text-gray-600">LinkedIn</span>
        </a>
      </div>
    </div>
  );
};

export default ActionButton;
