PROJECT_ID := 
REGION := 
HOSTING_BUCKET := 
HOSTING_BUCKET_LOCATION := 

set-cloud-config:
	gcloud auth login
	gcloud config set project $(PROJECT_ID)

create-cloud-resouces:
	gsutil mb -l $(HOSTING_BUCKET_LOCATION) -c STANDARD -b off gs://$(HOSTING_BUCKET)
	gsutil iam ch allUsers:objectViewer gs://$(HOSTING_BUCKET)
	gsutil web set -m index.html -e 404.html gs://$(HOSTING_BUCKET)

deploy:
	GENERATE_SOURCEMAP=false yarn react-scripts build
	gsutil rsync -d -r build gs://$(HOSTING_BUCKET)
