/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow;

function createWindow () {
	// Create the browser window
	mainWindow = new BrowserWindow({width: 800, height: 600, })
	
	// Load the index.html of the application
	mainWindow.loadURL(`file://${__dirname}/modules/sequence-diagram-editor/index.html`)

	// Open the DevTools
	//mainWindow.webContents.openDevTools()

	// Emitted when the window is closed
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
    	// in an array if your app supports multi windows, this is the time
    	// when you should delete the corresponding element.
		mainWindow = null
	})
}

// This method will be called when Electron has finished initialization and is 
// ready to create browser windows. Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit application when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
  	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
  	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})
