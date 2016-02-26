module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),
        "create-windows-installer": {
		    "x64": {
		      "appDirectory": "dist/win/POS_neDB-win32-x64",
		      "outputDirectory": "dist/win/64bit",
		      "authors": "yugandhar",
		      "exe": "POS_neDB.exe",
		      "iconUrl": "logo.ico",
		      "setupIcon": "logo.ico"
		    },
		    "ia32": {
		      "appDirectory": "dist/win/POS_neDB-win32-x64",
		      "outputDirectory": "dist/win/32bit",
		      "authors": "yugandhar",
		      "exe": "POS_neDB.exe",
		      "iconUrl": "logo.ico",
		      "setupIcon": "logo.ico"
		    }
		  }

    });


    grunt.loadNpmTasks("grunt-electron-installer")

};