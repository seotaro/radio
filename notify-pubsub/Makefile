
PROJECT_ID :=
PROJECT_NUMBER :=
ACCOUNT :=
ACCOUNT_ID :=
SERVICE_ACCOUNT :=
REGION :=
PARSE_DETAIL_APP :=
CRAWLER_PROJECT_ID :=
PUBSUB_NOTIFY_CRAWLER_TOPIC :=
PUBSUB_NOTIFY_CRAWLER_SUBSCRIPTION :=
PUBSUB_NOTIFY_FILE_TOPIC :=
PUBSUB_NOTIFY_FILE_SUBSCRIPTION :=


set-cloud-config:
	gcloud auth login
	gcloud config set project $(PROJECT_ID)

init:
	gcloud beta billing projects link $(PROJECT_ID) --billing-account=$(ACCOUNT_ID)
	gcloud services enable cloudbilling.googleapis.com
	gcloud services enable cloudbuild.googleapis.com
	gcloud services enable datastore.googleapis.com
	gcloud services enable run.googleapis.com
	
create-cloud-resouces:
	gcloud iam service-accounts create $(SERVICE_ACCOUNT)
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com --role=roles/pubsub.editor
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com --role=roles/storage.objectViewer
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com --role=roles/datastore.user
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:$(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com --role=roles/run.invoker
	gcloud projects add-iam-policy-binding $(PROJECT_ID) --member=serviceAccount:service-$(PROJECT_NUMBER)@gcp-sa-pubsub.iam.gserviceaccount.com --role=roles/iam.serviceAccountTokenCreator

	gcloud iam service-accounts keys create key.json --iam-account $(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com


	gcloud pubsub topics create $(PUBSUB_NOTIFY_FILE_TOPIC)
	
deploy:
	gcloud builds submit . --tag asia.gcr.io/$(PROJECT_ID)/$(PARSE_DETAIL_APP) --project $(PROJECT_ID) 
	gcloud run deploy $(PARSE_DETAIL_APP) \
		--project $(PROJECT_ID) \
		--image asia.gcr.io/$(PROJECT_ID)/$(PARSE_DETAIL_APP) \
		--platform managed \
		--region $(REGION) \
		--memory 256Mi \
		--concurrency 1 \
		--max-instances 2 \
		--no-allow-unauthenticated \
		--service-account $(SERVICE_ACCOUNT)@$(PROJECT_ID).iam.gserviceaccount.com \
		--set-env-vars "GOOGLE_CLOUD_PROJECT=$(PROJECT_ID),PUBSUB_TOPIC_NAME=$(PUBSUB_NOTIFY_FILE_TOPIC)"

