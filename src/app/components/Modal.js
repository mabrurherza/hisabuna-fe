import React, { useState } from 'react';

const MyModal = ({ header }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {};
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <button className="bg-emerald-500 hover:bg-emerald-800 text-white font-medium tracking-normal px-4 py-2 border border-emerald-500 rounded-lg flex gap-2 flex-row" onClick={handleShow}>
        <div className="plusicon">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white"><path d="M440-440v120q0 17 11.5 28.5T480-280q17 0 28.5-11.5T520-320v-120h120q17 0 28.5-11.5T680-480q0-17-11.5-28.5T640-520H520v-120q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640v120H320q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440h120Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
        </div>
        { header }
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-8 z-50">
            <h2 className="text-xl font-bold mb-4">{ header }</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input type="text" name="title" id="title" className="mt-1 focus:ring-emerald-500 focus:border-emerald-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div className="mt-4 flex justify-between">
                <button className="bg-emerald-500 hover:bg-emerald-800 text-white font-medium tracking-normal px-4 py-2 border border-emerald-500 rounded-lg" onClick={handleSave}>
                    Save
                </button>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2" onClick={handleClose}>
                    Close
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyModal;
