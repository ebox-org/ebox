{{/*
Expand the name of the chart.
*/}}
{{- define "helm.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "helm.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "helm.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "helm.labels" -}}
helm.sh/chart: {{ include "helm.chart" . }}
{{ include "helm.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "helm.selectorLabels" -}}
app.kubernetes.io/name: {{ include "helm.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{- define "helm.ingress-route" -}}
{{- printf "%s-ingress-route" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.web-app" -}}
{{- printf "%s-web-app" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.server.graphql-router" -}}
{{- printf "%s-server-graphql-router" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.server.node" -}}
{{- printf "%s-server-node" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.server.location" -}}
{{- printf "%s-server-location" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.server.message" -}}
{{- printf "%s-server-message" (include "helm.fullname" .) -}}
{{- end }}

{{- define "helm.server.file" -}}
{{- printf "%s-server-file" (include "helm.fullname" .) -}}
{{- end }}

# {{- list (include "helm.fullname" .) "server-node" | join "-" -}}
