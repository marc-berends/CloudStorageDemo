import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	constructor(private modalService: NgbModal) {}

	buckets:bucket[] = [
		new bucket('BestStorage', 'Ljubljana', []),
		new bucket('Pics', 'Kranj', []),
	];

	newBucketName = '';
	newBucketLocation = '';

	locations = [
		'Ljubljana',
		'Kranj',
		'Maribor',
	];

	showNewBucketCard = false;
	newBucketError = false;

	openNewBucketCard() {
		this.showNewBucketCard = true;
		this.newBucketName = '';
		this.newBucketLocation = '';
	}

	createNewBucket(name:string, location:string) {
		if(name == '' || location == '') {
			this.newBucketError = true;
			return;
		}
		this.newBucketError = false;
		this.showNewBucketCard = false;
		this.buckets.unshift(new bucket(name, location, []));
		this.logBucketsJSON();
	}

	selectedBucket = -1;

	activeTab = 0;

	getDateString(date:number) {
		return new Date(date).toLocaleString()
	}

	getSizeString(size:number) {
		if(size < 1000) {
			return size + ' B';
		}
		else if(size < 1000000) {
			return (size / 1000).toFixed(1) + ' KB';
		}
		else if(size < 1000000000) {
			return (size / 1000000).toFixed(1) + ' MB';
		}
		else {
			return (size / 1000000000).toFixed(1) + ' GB';
		}
	}

	getTotalSize(bucket:bucket) {
		return this.getSizeString(bucket.files.reduce((x, b) => x + b.size, 0));
	}

	handleFileInput(event:any) {
		for (let i = 0; i < event.target.files.length; i++) {
			this.buckets[this.selectedBucket].files.push(event.target.files[i])
		}
		this.logBucketsJSON();
	}

	logBucketsJSON() {
		console.log('Full current buckets storage in JSON format:')
		console.log(JSON.stringify(this.buckets))
	}

	deleteObject(i:number, context:any) {
		context.buckets[context.selectedBucket].files.splice(i, 1);
		this.logBucketsJSON();
	}

	deleteBucket(i:number, context:any) {
		context.buckets.splice(i, 1);
		context.selectedBucket = -1;
		this.logBucketsJSON();
	}

	openModal(content:any, callback:Function, i:number, title:string) {
		this.modalTitle = title;
		this.modalService.open(content);
		this.modalCallback = () => callback(i, this);
	}
	modalTitle = 'Are you sure?';
	modalCallback = () => {};
}

class bucket {
	name:string = '';
	location:string = '';
	files:File[] = [];

	constructor(name:string, location:string, files:File[]) {
		this.name = name;
		this.location = location;
		this.files = files;
	}
}