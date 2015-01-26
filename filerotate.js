// tmp領域のパス
var temp = Ti.Filesystem.tempDirectory

// バックアップファイルオブジェクト保存用の配列
var oldfileList = [];

// ダウンロードファイルオブジェクト保存用の配列
var downloadfileList = [];

// ダウンロード処理
var downloadfiles = function(){

// ロールバック処理
var rollback = function(){
	rollback_deletefiles();	
	rollback_restorefiles();
};

// ダウンロードファイルの削除
var rollback_deletefiles = function(){
	if(downloadfileList.length > 0){
		for(var i=0 in downloadfileList){	
			var bResult = downloadfileList[i].deleteFile(); 
			if(bResult == true){
				console.log("Delete download files success");
			} else {
				console.log("Delete download files failure");
			}
		}
	}
};

// バックアップファイルのリストア
var rollback_restorefiles = function(){
	if(oldfileList.length > 0){
		for(var i=0 in oldfileList){
			var oldFileName = oldfileList[i].name;
			var fileName = oldFileName.replace(/.old_/, "");
			var bResult = oldfileList[i].rename(fileName);
			if(bResult == true){
				console.log("Rollback file success");
			} else {
				console.log("Rollback file failure");
			}
		}
	}
};

// バックアップファイルの作成
var backup_oldfiles = function(){
	var fileList = Ti.Filesystem.getFile(temp).getDirectoryListing();
	for(var i=0 in fileList){
		var file = Ti.Filesystem.getFile(temp,fileList[i]);
		var oldFileName = ".old_"+ file.name;
		var bResult = file.rename(oldFileName);
		var oldFile = Ti.Filesystem.getFile(temp,oldFileName);	
		if(bResult == true){
			console.log('Rename success');
			oldfileList[i] = oldFile;
		} else {
			console.log('Rename failure');
			rollback();
		}
	}
};

// バックアップファイル削除
var remove_oldfiles = function(){
	for (var i=0 in oldfileList){
		var bResult = oldfileList[i].deleteFile(); 
		if(bResult == true){
			console.log("Delete old files success");
		} else {
			console.log("Delete old files failure");
		}
	}
};