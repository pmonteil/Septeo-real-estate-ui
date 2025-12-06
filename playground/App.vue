<template>
  <div class="playground">
    <h1>Design System Components</h1>

    <!-- ===================== -->
    <!-- UISNACKBAR            -->
    <!-- ===================== -->
    <section>
      <h2>UiSnackbar</h2>
      <div class="row">
        <UiButton label="Info" icon="info-circle" @click="showSnackbar('default')" />
        <UiButton label="Succès" icon="check" variant="secondary" @click="showSnackbar('success')" />
        <UiButton label="Erreur" icon="x" variant="error" @click="showSnackbar('error')" />
        <UiButton label="Attention" icon="alert-triangle" variant="accent" @click="showSnackbar('warning')" />
      </div>
      <div class="snackbar-container">
        <UiSnackbar
          v-model="demoSnackbar"
          :title="demoSnackbarTitle"
          :message="demoSnackbarMessage"
          :status="demoSnackbarStatus"
          :duration="5000"
          link-text="Plus de détails"
        />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIPILL                -->
    <!-- ===================== -->
    <section>
      <h2>UiPill</h2>
      <div class="row">
        <UiPill label="En cours" color="blue" icon="refresh" />
        <UiPill label="Annulé" color="red" icon="x" />
        <UiPill label="En attente" color="orange" icon="alert-circle" />
        <UiPill label="Validé" color="green" icon="circle-check" />
        <UiPill label="Exporté" color="purple" icon="arrow-up-right" />
        <UiPill label="Archivé" color="grey" icon="archive" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITABLE               -->
    <!-- ===================== -->
    <section class="section--wide">
      <h2>UiTable</h2>
      <UiTable
        title="Liste des biens"
        :columns="tableColumns"
        :rows="tableRows"
        :toolbar-actions="tableToolbarActions"
        @toolbar-action="handleToolbarAction"
        @cell-action="handleCellAction"
      />
    </section>

    <!-- ===================== -->
    <!-- UITAB                 -->
    <!-- ===================== -->
    <section>
      <h2>UiTab</h2>
      <div class="column">
        <h3>Tabs simples</h3>
        <UiTab v-model="selectedTab" :tabs="simpleTabs" />
        <p class="hint">Onglet sélectionné : {{ selectedTab }}</p>
      </div>
      <div class="column" style="margin-top: 24px;">
        <h3>Tabs avec icônes</h3>
        <UiTab v-model="selectedTabWithIcon" :tabs="tabsWithIcons" />
      </div>
      <div class="column" style="margin-top: 24px;">
        <h3>Tabs avec état désactivé</h3>
        <UiTab v-model="selectedTabDisabled" :tabs="tabsWithDisabled" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITAB DARK            -->
    <!-- ===================== -->
    <section>
      <h2>UiTabDark</h2>
      <div class="dark-background" style="background-color: #2E3862; padding: 24px; border-radius: 12px;">
        <div class="column">
          <h3 style="color: white; margin-bottom: 16px;">Tabs sur fond sombre</h3>
          <UiTabDark v-model="selectedTabDark" :tabs="simpleTabs" />
        </div>
        <div class="column" style="margin-top: 24px;">
          <h3 style="color: white; margin-bottom: 16px;">Tabs avec icônes</h3>
          <UiTabDark v-model="selectedTabDarkWithIcon" :tabs="tabsWithIcons" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UILABEL               -->
    <!-- ===================== -->
    <section>
      <h2>UiLabel</h2>
      <div class="row">
        <UiLabel label="Label par défaut" />
        <UiLabel label="Label requis" required />
        <UiLabel label="Sans icône" :icon="false" />
        <UiLabel label="Icône custom" icon="help" />
        <UiLabel label="Avec tooltip" tooltip="Ceci est une explication utile pour l'utilisateur" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIBADGE               -->
    <!-- ===================== -->
    <section>
      <h2>UiBadge - Taille Default (avec nombre)</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Default (bleu)</span>
          <UiBadge :value="5" status="default" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error (rouge)</span>
          <UiBadge :value="12" status="error" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Success (vert)</span>
          <UiBadge :value="99" status="success" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Max dépassé</span>
          <UiBadge :value="150" :max="99" status="error" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiBadge - Taille XS (point)</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Default</span>
          <UiBadge size="xs" status="default" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error</span>
          <UiBadge size="xs" status="error" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Success</span>
          <UiBadge size="xs" status="success" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITAG                 -->
    <!-- ===================== -->
    <section>
      <h2>UiTag - États</h2>
      <div class="row">
        <!-- Unselected -->
        <UiTag label="Tag" :selected="false" />
        
        <!-- Selected -->
        <UiTag label="Tag" :selected="true" />
        
        <!-- Disabled -->
        <UiTag label="Disabled" :disabled="true" />
      </div>
    </section>

    <section>
      <h2>UiTag - Interactif</h2>
      <div class="row">
        <UiTag 
          v-for="tag in tags" 
          :key="tag.id" 
          :label="tag.label" 
          :selected="tag.selected"
          @toggle="(selected) => tag.selected = selected"
        />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIAVATAR              -->
    <!-- ===================== -->
    <section>
      <h2>UiAvatar - Tailles</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">XS (28px)</span>
          <UiAvatar initials="PM" size="xs" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Default (48px)</span>
          <UiAvatar initials="PM" size="default" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XL (64px)</span>
          <UiAvatar initials="PM" size="xl" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiAvatar - Type Photo</h2>
      <div class="row">
        <UiAvatar type="photo" src="https://i.pravatar.cc/150?img=12" size="xs" />
        <UiAvatar type="photo" src="https://i.pravatar.cc/150?img=12" size="default" />
        <UiAvatar type="photo" src="https://i.pravatar.cc/150?img=12" size="xl" />
      </div>
    </section>

    <section>
      <h2>UiAvatar - Type Colored</h2>
      <div class="row">
        <UiAvatar type="colored" color="red" initials="AB" />
        <UiAvatar type="colored" color="blue" initials="CD" />
        <UiAvatar type="colored" color="green" initials="EF" />
        <UiAvatar type="colored" color="orange" initials="GH" />
        <UiAvatar type="colored" color="purple" initials="IJ" />
      </div>
    </section>

    <section>
      <h2>UiAvatar - Colored en différentes tailles</h2>
      <div class="row">
        <UiAvatar type="colored" color="blue" initials="PM" size="xs" />
        <UiAvatar type="colored" color="blue" initials="PM" size="default" />
        <UiAvatar type="colored" color="blue" initials="PM" size="xl" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIBREADCRUMB          -->
    <!-- ===================== -->
    <section>
      <h2>UiBreadcrumb</h2>
      <div class="column">
        <!-- Breadcrumb simple -->
        <div class="input-demo">
          <span class="input-demo__label">Navigation simple</span>
          <UiBreadcrumb :items="breadcrumbSimple" />
        </div>

        <!-- Breadcrumb complet -->
        <div class="input-demo">
          <span class="input-demo__label">Navigation complète</span>
          <UiBreadcrumb :items="breadcrumbFull" />
        </div>

        <!-- Breadcrumb avec icônes -->
        <div class="input-demo">
          <span class="input-demo__label">Avec icône sur le premier élément</span>
          <UiBreadcrumb :items="breadcrumbWithIcon" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UILINK                -->
    <!-- ===================== -->
    <section>
      <h2>UiLink - États</h2>
      <div class="row">
        <!-- Default -->
        <UiLink
          label="Lien par défaut"
          icon-left="home"
          icon-right="external-link"
          href="#"
        />

        <!-- Active -->
        <UiLink
          label="Lien actif"
          icon-left="home"
          icon-right="external-link"
          :active="true"
          href="#"
        />

        <!-- Disabled -->
        <UiLink
          label="Lien désactivé"
          icon-left="home"
          icon-right="external-link"
          :disabled="true"
          href="#"
        />
      </div>
    </section>

    <section>
      <h2>UiLink - Variantes</h2>
      <div class="row">
        <!-- Sans icône -->
        <UiLink
          label="Sans icône"
          href="#"
        />

        <!-- Icône gauche uniquement -->
        <UiLink
          label="Icône gauche"
          icon-left="arrow-left"
          href="#"
        />

        <!-- Icône droite uniquement -->
        <UiLink
          label="Icône droite"
          icon-right="arrow-right"
          href="#"
        />

        <!-- Autres icônes -->
        <UiLink
          label="Télécharger"
          icon-left="download"
          href="#"
        />

        <UiLink
          label="Voir plus"
          icon-right="chevron-right"
          href="#"
        />

        <UiLink
          label="Retour"
          icon-left="arrow-back"
          href="#"
        />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISWITCH              -->
    <!-- ===================== -->
    <section>
      <h2>UiSwitch - États</h2>
      <div class="grid-inputs">
        <!-- Default - Off -->
        <div class="input-demo">
          <span class="input-demo__label">Default (off)</span>
          <UiSwitch v-model="switch1" label="Activer les notifications" />
        </div>

        <!-- Default - On -->
        <div class="input-demo">
          <span class="input-demo__label">Default (on)</span>
          <UiSwitch v-model="switch2" label="Mode sombre activé" />
        </div>

        <!-- Error - Off -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (off)</span>
          <UiSwitch v-model="switch3" label="Option requise" :error="true" />
        </div>

        <!-- Error - On -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (on)</span>
          <UiSwitch v-model="switch4" label="Valeur en erreur" :error="true" />
        </div>

        <!-- Disabled - Off -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (off)</span>
          <UiSwitch :model-value="false" label="Option indisponible" :disabled="true" />
        </div>

        <!-- Disabled - On -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (on)</span>
          <UiSwitch :model-value="true" label="Option verrouillée" :disabled="true" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiSwitch - Sans label</h2>
      <div class="row">
        <UiSwitch :model-value="false" />
        <UiSwitch :model-value="true" />
        <UiSwitch :model-value="false" :error="true" />
        <UiSwitch :model-value="true" :error="true" />
        <UiSwitch :model-value="false" :disabled="true" />
        <UiSwitch :model-value="true" :disabled="true" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UICHECKBOX            -->
    <!-- ===================== -->
    <section>
      <h2>UiCheckbox - États</h2>
      <div class="grid-inputs">
        <!-- Default - Unchecked -->
        <div class="input-demo">
          <span class="input-demo__label">Default (non coché)</span>
          <UiCheckbox v-model="checkbox1" label="J'accepte les conditions" />
        </div>

        <!-- Default - Checked -->
        <div class="input-demo">
          <span class="input-demo__label">Default (coché)</span>
          <UiCheckbox v-model="checkbox2" label="Option sélectionnée" />
        </div>

        <!-- Error - Unchecked -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (non coché)</span>
          <UiCheckbox v-model="checkbox3" label="Ce champ est requis" :error="true" />
        </div>

        <!-- Error - Checked -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (coché)</span>
          <UiCheckbox v-model="checkbox4" label="Valeur en erreur" :error="true" />
        </div>

        <!-- Disabled - Unchecked -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (non coché)</span>
          <UiCheckbox :model-value="false" label="Option indisponible" :disabled="true" />
        </div>

        <!-- Disabled - Checked -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (coché)</span>
          <UiCheckbox :model-value="true" label="Option verrouillée" :disabled="true" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiCheckbox - Sans label</h2>
      <div class="row">
        <UiCheckbox :model-value="false" />
        <UiCheckbox :model-value="true" />
        <UiCheckbox :model-value="false" :error="true" />
        <UiCheckbox :model-value="true" :error="true" />
        <UiCheckbox :model-value="false" :disabled="true" />
        <UiCheckbox :model-value="true" :disabled="true" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIRADIO               -->
    <!-- ===================== -->
    <section>
      <h2>UiRadio - États</h2>
      <div class="grid-inputs">
        <!-- Default Group -->
        <div class="input-demo">
          <span class="input-demo__label">Default (groupe)</span>
          <div class="column">
            <UiRadio v-model="radioValue1" name="group1" value="option1" label="Option 1" />
            <UiRadio v-model="radioValue1" name="group1" value="option2" label="Option 2" />
            <UiRadio v-model="radioValue1" name="group1" value="option3" label="Option 3" />
          </div>
        </div>

        <!-- Another Group -->
        <div class="input-demo">
          <span class="input-demo__label">Autre groupe</span>
          <div class="column">
            <UiRadio v-model="radioValue2" name="group2" value="optionA" label="Choix A" />
            <UiRadio v-model="radioValue2" name="group2" value="optionB" label="Choix B" />
          </div>
        </div>

        <!-- Error Group -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur</span>
          <div class="column">
            <UiRadio v-model="radioValueError" name="group3" value="error1" label="Option en erreur" :error="true" />
            <UiRadio v-model="radioValueError" name="group3" value="error2" label="Autre option" :error="true" />
          </div>
        </div>

        <!-- Disabled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé</span>
          <div class="column">
            <UiRadio model-value="disabled1" name="group4" value="disabled1" label="Option verrouillée" :disabled="true" />
            <UiRadio model-value="disabled1" name="group4" value="disabled2" label="Non disponible" :disabled="true" />
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2>UiRadio - Sans label</h2>
      <div class="row">
        <UiRadio model-value="a" name="nolabel" value="a" />
        <UiRadio model-value="a" name="nolabel" value="b" />
        <UiRadio model-value="c" name="nolabel-error" value="c" :error="true" />
        <UiRadio model-value="c" name="nolabel-error" value="d" :error="true" />
        <UiRadio model-value="e" name="nolabel-disabled" value="e" :disabled="true" />
        <UiRadio model-value="e" name="nolabel-disabled" value="f" :disabled="true" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITEXTAREA            -->
    <!-- ===================== -->
    <section>
      <h2>UiTextarea - États</h2>
      <div class="grid-inputs">
        <!-- Default - Empty -->
        <div class="input-demo">
          <span class="input-demo__label">Default (vide)</span>
          <UiTextarea
            v-model="textareaEmpty"
            label="Description"
            label-icon="help-circle"
            label-tooltip="Décrivez votre bien immobilier"
            placeholder="Entrez une description..."
            info-message="Ce champ permet de décrire en détail votre bien"
          />
        </div>

        <!-- Default - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (rempli)</span>
          <UiTextarea
            v-model="textareaFilled"
            label="Description"
            label-icon="help-circle"
            placeholder="Entrez une description..."
            info-message="Vous pouvez modifier cette description à tout moment"
          />
        </div>

        <!-- Error - Empty -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (vide)</span>
          <UiTextarea
            v-model="textareaError"
            label="Description"
            label-icon="help-circle"
            placeholder="Entrez une description..."
            :error="true"
            error-message="Ce champ est requis"
          />
        </div>

        <!-- Error - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (rempli)</span>
          <UiTextarea
            model-value="Texte trop court"
            label="Description"
            label-icon="help-circle"
            placeholder="Entrez une description..."
            :error="true"
            error-message="La description doit contenir au moins 50 caractères"
          />
        </div>

        <!-- Disabled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé</span>
          <UiTextarea
            label="Description"
            placeholder="Non disponible"
            :disabled="true"
          />
        </div>

        <!-- With hint text -->
        <div class="input-demo">
          <span class="input-demo__label">Avec hint text</span>
          <UiTextarea
            label="Commentaire"
            placeholder="Votre commentaire..."
            hint-text="Maximum 500 caractères"
          />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIINPUT               -->
    <!-- ===================== -->
    <section>
      <h2>UiInput - États</h2>
      <div class="grid-inputs">
        <!-- Default - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (vide)</span>
          <UiInput
            v-model="inputEmpty"
            label="Nom"
            label-icon="help-circle"
            label-tooltip="Entrez votre nom complet tel qu'il apparaît sur vos documents officiels"
            placeholder="Entrez votre nom"
            icon-left="user"
          />
        </div>

        <!-- Default - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (rempli)</span>
          <UiInput
            v-model="inputFilled"
            label="Nom"
            label-icon="help-circle"
            label-tooltip="Entrez votre nom complet tel qu'il apparaît sur vos documents officiels"
            placeholder="Entrez votre nom"
            icon-left="user"
          />
        </div>

        <!-- Error - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (vide)</span>
          <UiInput
            v-model="inputError"
            label="Email"
            label-icon="help-circle"
            label-tooltip="Votre adresse email professionnelle"
            placeholder="Entrez votre email"
            icon-left="mail"
            :error="true"
            error-message="Ce champ est requis"
          />
        </div>

        <!-- Error - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (rempli)</span>
          <UiInput
            model-value="email@invalide"
            label="Email"
            label-icon="help-circle"
            label-tooltip="Votre adresse email professionnelle"
            placeholder="Entrez votre email"
            icon-left="mail"
            :error="true"
            error-message="Format d'email invalide"
          />
        </div>

        <!-- Disabled - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (vide)</span>
          <UiInput
            label="Téléphone"
            label-icon="help-circle"
            placeholder="Non disponible"
            icon-left="phone"
            :disabled="true"
          />
        </div>

        <!-- Disabled - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (rempli)</span>
          <UiInput
            v-model="inputDisabled"
            label="Téléphone"
            label-icon="help-circle"
            placeholder="Non disponible"
            icon-left="phone"
            :disabled="true"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>UiInput - Variantes</h2>
      <div class="grid-inputs">
        <!-- Sans label -->
        <div class="input-demo">
          <span class="input-demo__label">Sans label</span>
          <UiInput
            placeholder="Rechercher..."
            icon-left="search"
          />
        </div>

        <!-- Sans icône -->
        <div class="input-demo">
          <span class="input-demo__label">Sans icône</span>
          <UiInput
            label="Commentaire"
            placeholder="Votre commentaire..."
          />
        </div>

        <!-- Avec hint text -->
        <div class="input-demo">
          <span class="input-demo__label">Avec hint text</span>
          <UiInput
            label="Mot de passe"
            label-icon="help-circle"
            placeholder="••••••••"
            icon-left="lock"
            hint-text="Minimum 8 caractères"
          />
        </div>

        <!-- Label requis -->
        <div class="input-demo">
          <span class="input-demo__label">Label requis</span>
          <UiInput
            label="Adresse"
            label-icon="help-circle"
            :label-required="true"
            placeholder="123 rue Example"
            icon-left="map-pin"
          />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIINPUTSUFFIX         -->
    <!-- ===================== -->
    <section>
      <h2>UiInputSuffix - États</h2>
      <div class="grid-inputs">
        <!-- Default - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (vide)</span>
          <UiInputSuffix
            v-model="suffixEmpty"
            label="Surface"
            label-icon="help-circle"
            label-tooltip="Surface habitable du bien en mètres carrés"
            placeholder="0"
            icon-left="ruler-2"
            suffix="m²"
          />
        </div>

        <!-- Default - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (rempli)</span>
          <UiInputSuffix
            v-model="suffixFilled"
            label="Surface"
            label-icon="help-circle"
            label-tooltip="Surface habitable du bien en mètres carrés"
            placeholder="0"
            icon-left="ruler-2"
            suffix="m²"
          />
        </div>

        <!-- Error -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur</span>
          <UiInputSuffix
            label="Surface"
            label-icon="help-circle"
            label-tooltip="Surface habitable du bien en mètres carrés"
            placeholder="0"
            icon-left="ruler-2"
            suffix="m²"
            :error="true"
            error-message="La surface doit être supérieure à 0"
          />
        </div>

        <!-- Disabled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé</span>
          <UiInputSuffix
            model-value="100"
            label="Surface"
            label-icon="help-circle"
            placeholder="0"
            icon-left="ruler-2"
            suffix="m²"
            :disabled="true"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>UiInputSuffix - Différents suffixes</h2>
      <div class="grid-inputs">
        <!-- Prix -->
        <div class="input-demo">
          <span class="input-demo__label">Prix</span>
          <UiInputSuffix
            v-model="suffixPrice"
            label="Budget"
            label-icon="help-circle"
            placeholder="0"
            icon-left="currency-euro"
            suffix="€"
          />
        </div>

        <!-- Durée -->
        <div class="input-demo">
          <span class="input-demo__label">Durée</span>
          <UiInputSuffix
            v-model="suffixDuration"
            label="Temps de trajet"
            label-icon="help-circle"
            placeholder="0"
            icon-left="clock"
            suffix="min"
          />
        </div>

        <!-- Pourcentage -->
        <div class="input-demo">
          <span class="input-demo__label">Pourcentage</span>
          <UiInputSuffix
            label="Taux"
            label-icon="help-circle"
            placeholder="0"
            icon-left="percentage"
            suffix="%"
          />
        </div>

        <!-- Kilomètres -->
        <div class="input-demo">
          <span class="input-demo__label">Distance</span>
          <UiInputSuffix
            label="Rayon"
            label-icon="help-circle"
            placeholder="0"
            icon-left="map-pin"
            suffix="km"
          />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIBUTTON              -->
    <!-- ===================== -->

    <section>
      <h2>Variants</h2>
      <div class="row">
        <UiButton label="Primary" icon="send" />
        <UiButton label="Secondary" icon="settings" variant="secondary" />
        <UiButton label="Ghost" icon="edit" variant="ghost" />
        <UiButton label="Error" icon="trash" variant="error" />
        <UiButton label="Accent" icon="star" variant="accent" />
        <UiButton label="AI" icon="sparkles" variant="ai" />
      </div>
    </section>

    <section>
      <h2>Sizes</h2>
      <div class="row">
        <UiButton label="Size SM" icon="plus" size="sm" />
        <UiButton label="Size MD" icon="plus" size="md" />
      </div>
    </section>

    <section>
      <h2>Sans icône</h2>
      <div class="row">
        <UiButton label="Primary" />
        <UiButton label="Secondary" variant="secondary" />
        <UiButton label="Ghost" variant="ghost" />
      </div>
    </section>

    <section>
      <h2>Icône seule</h2>
      <div class="row">
        <UiButton icon="plus" />
        <UiButton icon="plus" variant="secondary" />
        <UiButton icon="plus" variant="ghost" />
      </div>
    </section>

    <section>
      <h2>États</h2>
      <div class="row">
        <UiButton label="Normal" icon="check" />
        <UiButton label="Disabled" icon="check" disabled />
        <UiButton label="Loading" icon="check" loading />
      </div>
    </section>

    <section>
      <h2>Autres icônes (strings)</h2>
      <div class="row">
        <UiButton label="Mail" icon="mail" />
        <UiButton label="Search" icon="search" />
        <UiButton label="Download" icon="download" />
        <UiButton label="Arrow Left" icon="arrow-left" />
        <UiButton label="Star" icon="star" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UiButton from "../src/components/UiButton.vue";
import UiLabel from "../src/components/UiLabel.vue";
import UiInput from "../src/components/UiInput.vue";
import UiInputSuffix from "../src/components/UiInputSuffix.vue";
import UiCheckbox from "../src/components/UiCheckbox.vue";
import UiRadio from "../src/components/UiRadio.vue";
import UiTextarea from "../src/components/UiTextarea.vue";
import UiSwitch from "../src/components/UiSwitch.vue";
import UiLink from "../src/components/UiLink.vue";
import UiBreadcrumb from "../src/components/UiBreadcrumb.vue";
import UiAvatar from "../src/components/UiAvatar.vue";
import UiTag from "../src/components/UiTag.vue";
import UiBadge from "../src/components/UiBadge.vue";
import UiSnackbar from "../src/components/UiSnackbar.vue";
import UiPill from "../src/components/UiPill.vue";
import UiTable from "../src/components/UiTable.vue";
import UiTab from "../src/components/UiTab.vue";
import UiTabDark from "../src/components/UiTabDark.vue";

// Textarea demos
const textareaEmpty = ref("");
const textareaFilled = ref("Ceci est un exemple de texte rempli dans le textarea. Il peut contenir plusieurs lignes de contenu.");
const textareaError = ref("");

// Radio demos
const radioValue1 = ref("option1");
const radioValue2 = ref("optionA");
const radioValueError = ref("error1");

// Tag demos
const tags = ref([
  { id: 1, label: "Paris", selected: true },
  { id: 2, label: "Lyon", selected: false },
  { id: 3, label: "Marseille", selected: false },
  { id: 4, label: "Bordeaux", selected: true },
  { id: 5, label: "Nice", selected: false },
]);

// Breadcrumb demos
const breadcrumbSimple = [
  { label: "Accueil", href: "#" },
  { label: "Biens", href: "#" },
  { label: "Appartement T3", href: "#" },
];

const breadcrumbFull = [
  { label: "Accueil", href: "#" },
  { label: "Immobilier", href: "#" },
  { label: "Location", href: "#" },
  { label: "Paris", href: "#" },
  { label: "75001", href: "#" },
  { label: "Appartement T3", href: "#" },
];

const breadcrumbWithIcon = [
  { label: "Accueil", href: "#", iconLeft: "home" },
  { label: "Paramètres", href: "#" },
  { label: "Profil", href: "#" },
];

// Switch demos
const switch1 = ref(false);
const switch2 = ref(true);
const switch3 = ref(false);
const switch4 = ref(true);

// Checkbox demos
const checkbox1 = ref(false);
const checkbox2 = ref(true);
const checkbox3 = ref(false);
const checkbox4 = ref(true);

// Input demos
const inputEmpty = ref("");
const inputFilled = ref("John Doe");
const inputError = ref("");
const inputDisabled = ref("Valeur désactivée");

// Input Suffix demos
const suffixEmpty = ref("");
const suffixFilled = ref(125);
const suffixPrice = ref(350000);
const suffixDuration = ref(45);

// Snackbar interactive demo
const demoSnackbar = ref(false);
const demoSnackbarStatus = ref<"default" | "success" | "error" | "warning">("default");
const demoSnackbarTitle = ref("Notification");
const demoSnackbarMessage = ref("Ceci est un message de notification.");

function showSnackbar(status: "default" | "success" | "error" | "warning") {
  const titles: Record<string, string> = {
    default: "Information",
    success: "Succès",
    error: "Erreur",
    warning: "Attention",
  };
  const messages: Record<string, string> = {
    default: "Votre action a été prise en compte.",
    success: "L'opération a été effectuée avec succès !",
    error: "Une erreur est survenue. Veuillez réessayer.",
    warning: "Cette action nécessite votre attention.",
  };
  
  demoSnackbarStatus.value = status;
  demoSnackbarTitle.value = titles[status];
  demoSnackbarMessage.value = messages[status];
  demoSnackbar.value = true;
}

// Table demos
const tableColumns = [
  { key: "reference", label: "Référence", icon: "hash" },
  { key: "type", label: "Type", icon: "building" },
  { key: "city", label: "Ville", icon: "map-pin" },
  { key: "price", label: "Prix", icon: "currency-euro" },
  { key: "surface", label: "Surface", icon: "ruler" },
  { 
    key: "status", 
    label: "Statut", 
    type: "pill" as const,
    pillIcon: "statusIcon",
    pillColor: "statusColor"
  },
  { 
    key: "actions", 
    label: "Actions", 
    type: "action" as const,
    sortable: false,
    actions: [
      { name: "view", icon: "eye" },
      { name: "edit", icon: "pencil" },
      { name: "menu", icon: "dots-vertical", secondary: true },
    ]
  },
];

const tableRows = [
  { reference: "BN-001", type: "Appartement T3", city: "Paris", price: "450 000 €", surface: "75 m²", status: "En cours", statusIcon: "refresh", statusColor: "blue" },
  { reference: "BN-002", type: "Maison", city: "Lyon", price: "680 000 €", surface: "120 m²", status: "Validé", statusIcon: "circle-check", statusColor: "green" },
  { reference: "BN-003", type: "Studio", city: "Marseille", price: "180 000 €", surface: "25 m²", status: "En attente", statusIcon: "alert-circle", statusColor: "orange" },
  { reference: "BN-004", type: "Appartement T2", city: "Bordeaux", price: "320 000 €", surface: "55 m²", status: "Annulé", statusIcon: "x", statusColor: "red" },
  { reference: "BN-005", type: "Villa", city: "Nice", price: "950 000 €", surface: "180 m²", status: "Exporté", statusIcon: "arrow-up-right", statusColor: "purple" },
  { reference: "BN-006", type: "Loft", city: "Lille", price: "420 000 €", surface: "90 m²", status: "Archivé", statusIcon: "archive", statusColor: "grey" },
];

const tableToolbarActions = [
  { name: "filter", icon: "filter" },
  { name: "sort", icon: "arrows-sort" },
  { name: "download", icon: "download" },
  { name: "add", icon: "plus", primary: true },
];

function handleToolbarAction(action: string) {
  console.log("Toolbar action:", action);
}

function handleCellAction(payload: { action: string; row: Record<string, unknown>; rowIndex: number }) {
  console.log("Cell action:", payload);
}

// Tab demos
const selectedTab = ref("all");
const simpleTabs = [
  { label: "All Teams", value: "all" },
  { label: "Sales", value: "sales" },
  { label: "Marketing", value: "marketing" },
  { label: "Customer Success", value: "customer" },
];

const selectedTabWithIcon = ref("dashboard");
const tabsWithIcons = [
  { label: "Dashboard", value: "dashboard", icon: "dashboard" },
  { label: "Biens", value: "properties", icon: "building" },
  { label: "Contacts", value: "contacts", icon: "users" },
  { label: "Rapports", value: "reports", icon: "chart-bar" },
];

const selectedTabDisabled = ref("active");
const selectedTabDark = ref("all");
const selectedTabDarkWithIcon = ref("dashboard");
const tabsWithDisabled = [
  { label: "Actifs", value: "active" },
  { label: "Archivés", value: "archived" },
  { label: "Brouillons", value: "drafts", disabled: true },
];
</script>

<style>
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f5f5;
  margin: 0;
  padding: 20px;
}

.playground {
  max-width: 1400px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 32px;
}

h2 {
  color: #666;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.grid-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.input-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-demo__label {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #96a4c1;
}

.snackbar-demo {
  gap: 16px;
}

.snackbar-container {
  margin-top: 16px;
  min-height: 150px;
}

.section--wide {
  max-width: none;
  overflow-x: auto;
}
</style>

<!-- Style global pour les tooltips Quasar (non scopé) -->
<style>
/* Tooltip global styling - fond noir */
.q-tooltip {
  font-family: var(--font-family-body, 'Inter', system-ui, sans-serif);
  font-size: 12px;
  background-color: var(--alias-neutral-900, #1f2937) !important;
  color: var(--alias-neutral-white, #ffffff) !important;
  padding: 6px 10px;
  border-radius: var(--alias-border-radius-sm, 4px);
}
</style>

