<template>
  <div class="container">
    <nav class="navbar">
      <h1 class="logo">Test K_rel</h1>
      <div class="nav-options">
        <i class="fa fa-user"></i>
        <i class="fa fa-power-off power-icon"></i>
      </div>
    </nav>
    <div class="content">
      <ul class="options-list">
        <li @click="show_tatou" class="option-item">Tatouer une image</li>
        <li @click="show_verify" class="option-item">Extraire des données</li>
      </ul>
    </div>

    <!-- Boîte de dialogue pour tatouer une image -->
    <div v-if="tatoue_img" class="section">
      <div class="section-content">
        <button @click="closeTatou" class="close-button">×</button>
        <h2>Télécharger une image</h2>
        <div class="form-group">
          <input type="file" @change="onFileChange" class="file-input" />
          <div class="metadata-input">
            <label for="metadata">Données à tatouer :</label>
            <textarea
              id="metadata"
              v-model="customMetadata"
              placeholder="Entrez les données à tatouer"
              rows="3"
              class="metadata-textarea"
            ></textarea>
          </div>
          <button @click="uploadImage" :disabled="!selectedFile" class="upload-button">
            Télécharger et Tatouer
          </button>
        </div>
        <div class="image-preview" v-if="previewUrl">
          <h3>Aperçu de l'image</h3>
          <img :src="previewUrl" alt="Aperçu" class="preview-image" />
        </div>
      </div>
    </div>

    <!-- Boîte de dialogue pour vérifier les métadonnées -->
    <div v-if="verifi_img" class="section">
      <div class="section-content">
        <button @click="closeVerify" class="close-button">×</button>
        <h2>Vérifier les métadonnées</h2>
        <div class="form-group">
          <input type="file" @change="onFileChangeForVerification" class="file-input" />
          <button @click="verifyMetadata" :disabled="!selectedFileForVerification" class="verify-button">
            Vérifier
          </button>
        </div>
        <div class="result" v-if="verificationResult">
          <h3>Résultat de la vérification</h3>
          <p>{{ verificationResult }}</p>
        </div>
      </div>
    </div>

    <!-- Affichage des métadonnées de l'image tatouée -->
    <div class="section" v-if="tatoueeMetadata">
      <h2>Métadonnées de l'image tatouée</h2>
      <div class="metadata-display">
        <p>{{ tatoueeMetadata }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'; // Importer uuid

export default {
  data() {
    return {
      selectedFile: null,
      selectedFileForVerification: null,
      verificationResult: '',
      tatoueeMetadata: '',
      previewUrl: null,
      customMetadata: '', // Initialisé à vide
      isUploading: false,
      tatoue_img: false,
      verifi_img: false
    };
  },
  methods: {
    show_tatou() {
      this.tatoue_img = true;
      this.verifi_img = false;
      this.generateMetadata(); // Générer un ID unique
    },
    show_verify() {
      this.verifi_img = true;
      this.tatoue_img = false;
    },
    closeTatou() {
      this.tatoue_img = false;
      this.resetForm();
    },
    closeVerify() {
      this.verifi_img = false;
      this.resetForm();
    },
    resetForm() {
      this.selectedFile = null;
      this.selectedFileForVerification = null;
      this.previewUrl = null;
      this.verificationResult = '';
      this.customMetadata = ''; // Réinitialiser les métadonnées
    },
    generateMetadata() {
      const uniqueId = uuidv4(); // Générer un UUID unique
      this.customMetadata = `ID_Patient:${uniqueId}`; // Pré-remplir avec l'ID généré
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      this.previewImage(this.selectedFile);
    },
    previewImage(file) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async uploadImage() {
      if (!this.selectedFile) {
        alert('Veuillez sélectionner une image à télécharger.');
        return;
      }

      this.isUploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('metadata', this.customMetadata);

      try {
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        alert(data.message);
        this.tatoueeMetadata = this.customMetadata;
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
        alert('Une erreur est survenue pendant le téléchargement.');
      } finally {
        this.isUploading = false;
      }
    },
    onFileChangeForVerification(event) {
      this.selectedFileForVerification = event.target.files[0];
    },
    async verifyMetadata() {
      console.log('Vérification des métadonnées...');
      if (!this.selectedFileForVerification) {
        alert('Veuillez sélectionner un fichier avant de vérifier.');
        return;
      }

      const formData = new FormData();
      formData.append('image', this.selectedFileForVerification);

      try {
        const response = await fetch('http://localhost:3000/verify', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log('Réponse du serveur:', data);
        this.verificationResult = data.metadata;
        this.tatoueeMetadata = data.metadata;
      } catch (error) {
        console.error('Erreur lors de la vérification des métadonnées :', error);
        this.verificationResult = 'Erreur lors de la vérification';
      }
    }
  },
};
</script>

<style>
:root {
  --primary-color: #4CAF50;
  --secondary-color: #f0f8ff;
  --background-color: #f9f9f9;
  --text-color: #333;
  --hover-color: #45a049;
  --disabled-color: #cccccc;
  --border-color: #ddd;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

body {
  margin: 0;
  font-family: 'Arial', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.container {
  width: 100%;
  margin: 0;
  padding: 10px;
}

.navbar {
  width: 90%;
  margin: auto;
  padding: 10px 1%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.logo {
  font-size: 24px;
  color: var(--primary-color);
}

.nav-options {
  display: flex;
  gap: 15px;
}

.power-icon {
  color: red;
  cursor: pointer;
}

.content {
  width: 60%;
  margin: auto;
  text-align: center;
}

.options-list {
  display: flex;
  justify-content: space-between;
  margin-top: 25vh;
  padding: 0;
  list-style: none;
}

.option-item {
  box-shadow: 0px 0px 10px var(--shadow-color);
  font-size: 24px;
  width: 36%;
  padding: 20px;
  border-radius: 15px;
  transition: all 0.3s;
  cursor: pointer;
}

.option-item:hover {
  background-color: var(--primary-color);
  color: white;
}

.section {
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.section-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px var(--shadow-color);
  width: 80%;
  max-width: 500px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--text-color);
}

.close-button:hover {
  color: var(--primary-color);
}

.form-group {
  margin-bottom: 15px;
}

.file-input {
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
}

.metadata-input {
  margin: 15px 0;
}

.metadata-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 10px;
}

.upload-button, .verify-button {
  padding: 10px 20px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-button:hover, .verify-button:hover {
  background-color: var(--hover-color);
}

.upload-button:disabled, .verify-button:disabled {
  background-color: var(--disabled-color);
  cursor: not-allowed;
}

.image-preview {
  margin: 20px 0;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.result, .metadata-display {
  padding: 15px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--secondary-color);
}
</style>