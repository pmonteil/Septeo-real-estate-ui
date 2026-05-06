<template>
  <div class="playground">
    <!-- TAB BAR -->
    <div class="playground-tabs">
      <button
        class="playground-tabs__btn"
        :class="{ 'playground-tabs__btn--active': activeTab === 'components' }"
        @click="activeTab = 'components'"
      >
        Composants
      </button>
      <button
        class="playground-tabs__btn"
        :class="{ 'playground-tabs__btn--active': activeTab === 'tokens' }"
        @click="activeTab = 'tokens'"
      >
        Design Tokens
      </button>
    </div>

    <!-- TAB: TOKENS -->
    <TokensPage v-if="activeTab === 'tokens'" />

    <!-- TAB: COMPONENTS -->
    <div v-show="activeTab === 'components'">
    <h1>Design System Components</h1>

    <!-- ===================== -->
    <!-- UICONTAINERSHEADER    -->
    <!-- ===================== -->
    <section class="section--wide">
      <h2>UiContainersHeader - Default</h2>
      <UiContainersHeader title="Liste des biens" @back="() => {}">
        <template #state>
          <UiPill label="Actif" color="green" icon="circle-check" />
          <UiPill label="Vente" color="blue" icon="building" />
        </template>
        <template #tabs>
          <UiTab v-model="containerTabDefault" :tabs="simpleTabs" />
        </template>
        <template #actions>
          <UiButton label="Générer" icon="sparkles" variant="ai" />
          <UiButton label="Ajouter" icon="plus" />
        </template>
      </UiContainersHeader>
    </section>

    <section class="section--wide">
      <h2>UiContainersHeader - XS</h2>
      <UiContainersHeader title="Détail du bien" size="xs" @back="() => {}">
        <template #state>
          <UiPill label="Actif" color="green" icon="circle-check" />
        </template>
        <template #tabs>
          <UiTab v-model="containerTabXs" :tabs="simpleTabs" />
        </template>
        <template #actions>
          <UiButton label="Générer" icon="sparkles" variant="ai" size="sm" />
          <UiButton label="Ajouter" icon="plus" size="sm" />
        </template>
      </UiContainersHeader>
    </section>

    <section class="section--wide">
      <h2>UiContainersHeader - Sans bouton retour</h2>
      <UiContainersHeader title="Dashboard" :show-back-button="false">
        <template #tabs>
          <UiTab v-model="containerTabDefault" :tabs="simpleTabs" />
        </template>
        <template #actions>
          <UiButton label="Exporter" icon="download" variant="secondary" />
        </template>
      </UiContainersHeader>
    </section>

    <!-- ===================== -->
    <!-- UIDYNAMICINPUT        -->
    <!-- ===================== -->
    <section>
      <h2>UiDynamicInput</h2>
      <div class="grid-inputs">
        <div class="input-demo">
          <span class="input-demo__label">Default - Empty</span>
          <UiDynamicInput
            v-model="dynamicEmpty"
            label="label"
            label-icon="info-circle"
            label-tooltip="Insérez des variables dynamiques"
          />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Default - Filled</span>
          <UiDynamicInput
            v-model="dynamicFilled"
            label="label"
            label-icon="info-circle"
            label-tooltip="Insérez des variables dynamiques"
          />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error - Empty</span>
          <UiDynamicInput
            v-model="dynamicError"
            label="label"
            label-icon="info-circle"
            :error="true"
            hint-text="Hint text"
          />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error - Filled</span>
          <UiDynamicInput
            v-model="dynamicErrorFilled"
            label="label"
            label-icon="info-circle"
            :error="true"
            hint-text="Hint text"
          />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiDynamicInput
            v-model="dynamicDisabled"
            label="label"
            label-icon="info-circle"
            :disabled="true"
          />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIPOPUP               -->
    <!-- ===================== -->
    <section>
      <h2>UiPopup</h2>
      <div class="row">
        <UiButton
          label="Popup neutral"
          icon="info-circle"
          @click="showPopupPositive = true"
        />
        <UiButton
          label="Popup danger"
          icon="trash"
          variant="error"
          @click="showPopupNegative = true"
        />
        <UiButton
          label="Popup warning"
          icon="alert-triangle"
          variant="accent"
          @click="showPopupWarning = true"
        />
        <UiButton
          label="Popup neutre"
          icon="alien"
          variant="ghost"
          @click="showPopupNeutral = true"
        />
      </div>

      <!-- Popup instances -->
      <UiPopup
        v-model="showPopupPositive"
        variant="neutral"
        title="Confirmer l'action"
        description="Êtes-vous sûr de vouloir confirmer cette action ? Cette opération peut prendre quelques instants."
        confirm-label="Je confirme"
        confirm-icon="check"
        cancel-label="Retour"
        @confirm="handlePopupConfirm"
        @cancel="handlePopupCancel"
      />

      <UiPopup
        v-model="showPopupNegative"
        variant="danger"
        title="Supprimer cet élément ?"
        description="Cette action est irréversible. Toutes les données associées seront définitivement supprimées."
        confirm-label="Supprimer"
        confirm-icon="trash"
        cancel-label="Retour"
        @confirm="handlePopupDelete"
      />

      <UiPopup
        v-model="showPopupWarning"
        variant="neutral"
        icon-variant="warning"
        title="Attention requise"
        description="Cette action nécessite votre attention. Veuillez vérifier les informations avant de continuer."
        confirm-label="Continuer"
        confirm-icon="arrow-right"
        cancel-label="Annuler"
      />

      <UiPopup
        v-model="showPopupNeutral"
        variant="neutral"
        icon-variant="neutral"
        title="Information"
        description="Ceci est une popup d'information générale avec une icône neutre."
        confirm-label="Compris"
        confirm-icon="check"
        :cancel-label="''"
      />
    </section>

    <!-- ===================== -->
    <!-- UIPOPUPICON           -->
    <!-- ===================== -->
    <section>
      <h2>UiPopupIcon - Variantes</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Information</span>
          <UiPopupIcon variant="information" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error</span>
          <UiPopupIcon variant="error" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Warning</span>
          <UiPopupIcon variant="warning" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Neutral</span>
          <UiPopupIcon variant="neutral" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISNACKBAR            -->
    <!-- ===================== -->
    <section>
      <h2>UiSnackbar</h2>
      <div class="row">
        <UiButton
          label="Info"
          icon="info-circle"
          @click="showSnackbar('default')"
        />
        <UiButton
          label="Succès"
          icon="check"
          variant="secondary"
          @click="showSnackbar('success')"
        />
        <UiButton
          label="Erreur"
          icon="x"
          variant="error"
          @click="showSnackbar('error')"
        />
        <UiButton
          label="Attention"
          icon="alert-triangle"
          variant="accent"
          @click="showSnackbar('warning')"
        />
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
    <!-- UITOGGLE              -->
    <!-- ===================== -->
    <section>
      <h2>UiToggle</h2>
      <div class="column">
        <h3>Toggle avec label et icônes</h3>
        <UiToggle
          v-model="selectedToggle"
          :options="toggleOptions"
          label="Notification"
          label-tooltip="Choisissez votre mode de notification préféré"
        />
        <p class="hint">Option sélectionnée : {{ selectedToggle }}</p>
      </div>
      <div class="column" style="margin-top: 24px">
        <h3>Toggle sans label</h3>
        <UiToggle v-model="selectedToggleText" :options="toggleOptionsText" />
      </div>
      <div class="column" style="margin-top: 24px">
        <h3>Toggle avec label requis</h3>
        <UiToggle
          v-model="selectedToggleDisabled"
          :options="toggleOptionsDisabled"
          label="Statut"
          :required="true"
        />
      </div>
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
      <div class="column" style="margin-top: 24px">
        <h3>Tabs avec icônes</h3>
        <UiTab v-model="selectedTabWithIcon" :tabs="tabsWithIcons" />
      </div>
      <div class="column" style="margin-top: 24px">
        <h3>Tabs avec état désactivé</h3>
        <UiTab v-model="selectedTabDisabled" :tabs="tabsWithDisabled" />
      </div>
      <div class="column" style="margin-top: 24px">
        <h3>Tabs XS</h3>
        <UiTab v-model="selectedTabXs" :tabs="simpleTabs" size="xs" />
      </div>
      <div class="column" style="margin-top: 24px">
        <h3>Tabs XS avec icônes</h3>
        <UiTab v-model="selectedTabXsIcon" :tabs="tabsWithIcons" size="xs" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITAB DARK            -->
    <!-- ===================== -->
    <section>
      <h2>UiTabDark</h2>
      <div
        class="dark-background"
        style="background-color: #2e3862; padding: 24px; border-radius: 12px"
      >
        <div class="column">
          <h3 style="color: white; margin-bottom: 16px">
            Tabs sur fond sombre
          </h3>
          <UiTabDark v-model="selectedTabDark" :tabs="simpleTabs" />
        </div>
        <div class="column" style="margin-top: 24px">
          <h3 style="color: white; margin-bottom: 16px">Tabs avec icônes</h3>
          <UiTabDark v-model="selectedTabDarkWithIcon" :tabs="tabsWithIcons" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIMENUOFFICE          -->
    <!-- ===================== -->
    <section>
      <h2>UiMenuOffice</h2>
      <div class="row" style="gap: 24px; align-items: stretch">
        <!-- Menu déplié -->
        <div class="menu-demo-container">
          <h4 style="margin-bottom: 12px; color: #666">Menu déplié</h4>
          <div class="menu-demo-wrapper">
            <UiMenuOffice
              v-model="selectedMenuItem"
              :items="menuItems"
              :user="currentUser"
              :collapsed="false"
              :show-toggle="false"
              @user-action="handleUserAction"
            />
          </div>
        </div>

        <!-- Menu plié -->
        <div class="menu-demo-container">
          <h4 style="margin-bottom: 12px; color: #666">Menu plié</h4>
          <div class="menu-demo-wrapper">
            <UiMenuOffice
              v-model="selectedMenuItem"
              :items="menuItems"
              :user="currentUser"
              :collapsed="true"
              :show-toggle="false"
              @user-action="handleUserAction"
            />
          </div>
        </div>

        <!-- Menu interactif -->
        <div class="menu-demo-container" style="flex: 1">
          <h4 style="margin-bottom: 12px; color: #666">
            Menu interactif (cliquez pour plier/déplier)
          </h4>
          <div class="menu-demo-wrapper" style="min-width: 250px">
            <UiMenuOffice
              v-model="selectedMenuItem"
              :items="menuItems"
              :user="currentUser"
              :collapsed="menuCollapsed"
              @toggle="menuCollapsed = !menuCollapsed"
              @user-action="handleUserAction"
            />
          </div>
          <p class="hint" style="margin-top: 12px">
            Élément sélectionné : {{ selectedMenuItem }}
          </p>
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITOPBAROFFICE        -->
    <!-- ===================== -->
    <section>
      <h2>UiTopbarOffice</h2>
      <div class="topbar-demo-container">
        <UiTopbarOffice
          :breadcrumb="demoBreadcrumb"
          :notification-count="5"
          @navigate="handleBreadcrumbNavigate"
          @notification-click="handleNotificationClick"
        />
      </div>
      <p class="hint" style="margin-top: 12px">
        Cliquez sur les éléments du fil d'Ariane ou sur l'icône notification
      </p>
    </section>

    <!-- ===================== -->
    <!-- UISELECT              -->
    <!-- ===================== -->
    <section>
      <h2>UiSelect - États</h2>
      <div class="grid-inputs">
        <!-- Default - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (vide)</span>
          <UiSelect
            v-model="selectEmpty"
            label="Type de bien"
            label-icon="help-circle"
            label-tooltip="Sélectionnez le type de bien immobilier"
            placeholder="Choisir un type"
            icon-left="building"
            :options="propertyTypes"
          />
        </div>

        <!-- Default - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Default (rempli)</span>
          <UiSelect
            v-model="selectFilled"
            label="Type de bien"
            label-icon="help-circle"
            label-tooltip="Sélectionnez le type de bien immobilier"
            placeholder="Choisir un type"
            icon-left="building"
            :options="propertyTypes"
          />
        </div>

        <!-- Error - Not filled -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (vide)</span>
          <UiSelect
            v-model="selectError"
            label="Ville"
            label-icon="help-circle"
            label-tooltip="Sélectionnez la ville"
            placeholder="Choisir une ville"
            icon-left="map-pin"
            :options="cities"
            :error="true"
            error-message="Ce champ est requis"
          />
        </div>

        <!-- Error - Filled -->
        <div class="input-demo">
          <span class="input-demo__label">Erreur (rempli)</span>
          <UiSelect
            v-model="selectErrorFilled"
            label="Ville"
            label-icon="help-circle"
            placeholder="Choisir une ville"
            icon-left="map-pin"
            :options="cities"
            :error="true"
            error-message="Cette ville n'est pas disponible"
          />
        </div>

        <!-- Disabled -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé</span>
          <UiSelect
            model-value="apartment"
            label="Type de bien"
            placeholder="Non disponible"
            icon-left="building"
            :options="propertyTypes"
            :disabled="true"
          />
        </div>

        <!-- With hint text -->
        <div class="input-demo">
          <span class="input-demo__label">Avec hint text</span>
          <UiSelect
            v-model="selectHint"
            label="Nombre de pièces"
            label-required
            placeholder="Sélectionner"
            icon-left="door"
            :options="roomOptions"
            hint-text="Chambres, salon, cuisine comptent comme pièces"
          />
        </div>
      </div>
    </section>

    <section>
      <h2>UiSelect - Variantes</h2>
      <div class="grid-inputs">
        <!-- Sans label -->
        <div class="input-demo">
          <span class="input-demo__label">Sans label</span>
          <UiSelect
            placeholder="Filtrer par statut..."
            icon-left="filter"
            :options="statusOptions"
          />
        </div>

        <!-- Sans icône -->
        <div class="input-demo">
          <span class="input-demo__label">Sans icône</span>
          <UiSelect
            label="Catégorie"
            placeholder="Choisir une catégorie"
            :options="['Vente', 'Location', 'Neuf', 'Ancien']"
          />
        </div>

        <!-- Options simples (strings) -->
        <div class="input-demo">
          <span class="input-demo__label">Options simples (strings)</span>
          <UiSelect
            v-model="selectSimple"
            label="Pays"
            placeholder="Sélectionner un pays"
            icon-left="world"
            :options="['France', 'Belgique', 'Suisse', 'Luxembourg']"
          />
        </div>

        <!-- Options avec disabled -->
        <div class="input-demo">
          <span class="input-demo__label">Options avec disabled</span>
          <UiSelect
            v-model="selectWithDisabled"
            label="Formule"
            placeholder="Choisir une formule"
            icon-left="star"
            :options="planOptions"
          />
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
        <UiLabel
          label="Avec tooltip"
          tooltip="Ceci est une explication utile pour l'utilisateur"
        />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIBADGE               -->
    <!-- ===================== -->
    <section>
      <h2>UiBadge - Type Notification</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Not Selected</span>
          <UiBadge :value="5" type="notification" status="not-selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Selected</span>
          <UiBadge :value="12" type="notification" status="selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiBadge :value="3" type="notification" status="disabled" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Max dépassé</span>
          <UiBadge :value="150" :max="99" type="notification" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS Not Selected</span>
          <UiBadge size="xs" type="notification" status="not-selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS Selected</span>
          <UiBadge size="xs" type="notification" status="selected" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiBadge - Type Quantity</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Not Selected</span>
          <UiBadge :value="99" type="quantity" status="not-selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Selected</span>
          <UiBadge :value="99" type="quantity" status="selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiBadge :value="99" type="quantity" status="disabled" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIFILTER              -->
    <!-- ===================== -->
    <section>
      <h2>UiFilter - Default</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">Not Selected</span>
          <UiFilter label="Type de bien" icon="building" :count="12" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Selected</span>
          <UiFilter label="Ville" icon="map-pin" :count="3" state="selected" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiFilter label="Statut" icon="filter" :count="2" :disabled="true" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Sans icône</span>
          <UiFilter label="Prix" :count="5" :show-dropdown="false" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiFilter - XS</h2>
      <div class="row">
        <div class="input-demo">
          <span class="input-demo__label">XS Not Selected</span>
          <UiFilter label="Type de bien" icon="building" :count="12" size="xs" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS Selected</span>
          <UiFilter label="Ville" icon="map-pin" :count="3" state="selected" size="xs" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS Disabled</span>
          <UiFilter label="Statut" icon="filter" :count="1" :disabled="true" size="xs" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS Sans icône</span>
          <UiFilter label="Prix" :count="5" :show-dropdown="false" size="xs" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiPill - Rounded</h2>
      <div class="row">
        <UiPill label="En cours" color="blue" icon="refresh" type="rounded" />
        <UiPill label="Annulé" color="red" icon="x" type="rounded" />
        <UiPill label="En attente" color="orange" icon="alert-circle" type="rounded" />
        <UiPill label="Validé" color="green" icon="circle-check" type="rounded" />
        <UiPill label="Exporté" color="purple" icon="arrow-up-right" type="rounded" />
        <UiPill label="Archivé" color="grey" icon="archive" type="rounded" />
      </div>
    </section>

    <section>
      <h2>UiPill - XS</h2>
      <div class="row">
        <UiPill label="En cours" color="blue" icon="refresh" size="xs" />
        <UiPill label="Annulé" color="red" icon="x" size="xs" />
        <UiPill label="Validé" color="green" icon="circle-check" size="xs" />
        <UiPill label="Exporté" color="purple" size="xs" type="rounded" />
        <UiPill label="Archivé" color="grey" size="xs" type="rounded" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIACCORDION           -->
    <!-- ===================== -->
    <section>
      <h2>UiAccordion</h2>
      <div class="column" style="gap: 12px; width: 100%">
        <UiAccordion
          v-model="accordion1"
          title="Design"
          icon="palette"
        >
          <template #state>
            <UiPill label="En cours" color="blue" icon="refresh" size="xs" />
          </template>
          <p style="margin: 0; color: var(--text-body-secondary)">
            Contenu de la section Design. Ici vous pouvez mettre n'importe quel contenu.
          </p>
        </UiAccordion>

        <UiAccordion
          v-model="accordion2"
          title="Développement"
          icon="code"
        >
          <p style="margin: 0; color: var(--text-body-secondary)">
            Contenu de la section Développement.
          </p>
        </UiAccordion>

        <UiAccordion
          title="Section en erreur"
          icon="alert-triangle"
          :error="true"
          :model-value="false"
        />

        <UiAccordion
          title="Section désactivée"
          icon="lock"
          :disabled="true"
          :model-value="false"
        />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIDROPDOWN            -->
    <!-- ===================== -->
    <section>
      <h2>UiDropdown</h2>
      <div class="row">
        <UiDropdown v-model="dropdownSelected" :items="dropdownItems" @select="handleDropdownSelect">
          <template #trigger="{ isOpen }">
            <UiButton :label="isOpen ? 'Fermer' : 'Ouvrir le menu'" icon="menu-2" variant="secondary" />
          </template>
        </UiDropdown>

        <UiDropdown :items="dropdownCheckboxItems" v-model="dropdownCheckboxSelected">
          <template #trigger>
            <UiButton label="Multi-select" icon="list-check" variant="secondary" />
          </template>
        </UiDropdown>
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
          @toggle="(selected) => (tag.selected = selected)"
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
        <UiAvatar
          type="photo"
          src="https://i.pravatar.cc/150?img=12"
          size="xs"
        />
        <UiAvatar
          type="photo"
          src="https://i.pravatar.cc/150?img=12"
          size="default"
        />
        <UiAvatar
          type="photo"
          src="https://i.pravatar.cc/150?img=12"
          size="xl"
        />
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
          <span class="input-demo__label"
            >Avec icône sur le premier élément</span
          >
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
        <UiLink label="Sans icône" href="#" />

        <!-- Icône gauche uniquement -->
        <UiLink label="Icône gauche" icon-left="arrow-left" href="#" />

        <!-- Icône droite uniquement -->
        <UiLink label="Icône droite" icon-right="arrow-right" href="#" />

        <!-- Autres icônes -->
        <UiLink label="Télécharger" icon-left="download" href="#" />

        <UiLink label="Voir plus" icon-right="chevron-right" href="#" />

        <UiLink label="Retour" icon-left="arrow-back" href="#" />
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
          <UiSwitch
            :model-value="false"
            label="Option indisponible"
            :disabled="true"
          />
        </div>

        <!-- Disabled - On -->
        <div class="input-demo">
          <span class="input-demo__label">Désactivé (on)</span>
          <UiSwitch
            :model-value="true"
            label="Option verrouillée"
            :disabled="true"
          />
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
      <h2>UiCheckbox — Style Label</h2>
      <div class="row">
        <UiCheckbox v-model="checkbox1" label="Unselected" />
        <UiCheckbox v-model="checkbox2" label="Selected" />
        <UiCheckbox :model-value="true" :indeterminate="true" label="Indeterminate" />
        <UiCheckbox :model-value="false" label="Disabled" :disabled="true" />
        <UiCheckbox :model-value="true" label="Disabled checked" :disabled="true" />
      </div>
    </section>

    <section>
      <h2>UiCheckbox — Style LabelIcon</h2>
      <div class="row">
        <UiCheckbox v-model="checkboxIcon1" label="Email" icon="mail" />
        <UiCheckbox v-model="checkboxIcon2" label="Téléphone" icon="phone" />
        <UiCheckbox v-model="checkboxIcon3" label="Maison" icon="home" />
        <UiCheckbox :model-value="false" label="Disabled" icon="lock" :disabled="true" />
      </div>
    </section>

    <section>
      <h2>UiCheckbox — Style Standalone (sans label)</h2>
      <div class="row">
        <UiCheckbox :model-value="false" />
        <UiCheckbox :model-value="true" />
        <UiCheckbox :model-value="true" :indeterminate="true" />
        <UiCheckbox :model-value="false" :disabled="true" />
        <UiCheckbox :model-value="true" :disabled="true" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIRADIO               -->
    <!-- ===================== -->
    <section>
      <h2>UiRadio — Groupe vertical</h2>
      <div class="row" style="align-items: flex-start; gap: 32px;">
        <div class="column">
          <span class="input-demo__label">Type de bien</span>
          <UiRadio v-model="radioValue1" name="typebien" value="maison" label="Maison" />
          <UiRadio v-model="radioValue1" name="typebien" value="appartement" label="Appartement" />
          <UiRadio v-model="radioValue1" name="typebien" value="terrain" label="Terrain" />
          <UiRadio v-model="radioValue1" name="typebien" value="local" label="Local commercial" />
        </div>
        <div class="column">
          <span class="input-demo__label">Canal préféré</span>
          <UiRadio v-model="radioValue2" name="canal" value="email" label="Email" />
          <UiRadio v-model="radioValue2" name="canal" value="sms" label="SMS" />
          <UiRadio v-model="radioValue2" name="canal" value="tel" label="Téléphone" />
        </div>
      </div>
    </section>

    <section>
      <h2>UiRadio — Groupe horizontal</h2>
      <div class="row">
        <UiRadio v-model="radioValue3" name="periode" value="mois" label="Ce mois" />
        <UiRadio v-model="radioValue3" name="periode" value="trim" label="Ce trimestre" />
        <UiRadio v-model="radioValue3" name="periode" value="annee" label="Cette année" />
      </div>
    </section>

    <section>
      <h2>UiRadio — Désactivé</h2>
      <div class="row">
        <UiRadio model-value="a" name="disabled-grp" value="a" label="Sélectionné verrouillé" :disabled="true" />
        <UiRadio model-value="a" name="disabled-grp" value="b" label="Indisponible" :disabled="true" />
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
          <UiInput placeholder="Rechercher..." icon-left="search" />
        </div>

        <!-- Sans icône -->
        <div class="input-demo">
          <span class="input-demo__label">Sans icône</span>
          <UiInput label="Commentaire" placeholder="Votre commentaire..." />
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
      <h2>Types — Label (Default)</h2>
      <div class="row">
        <UiButton label="Primary" icon="send" variant="primary" />
        <UiButton label="Secondary" icon="settings" variant="secondary" />
        <UiButton label="Tertiary" icon="plus" variant="tertiary" />
        <UiButton label="Text" icon="edit" variant="text" />
        <UiButton label="AI" icon="sparkles" variant="ai" />
        <UiButton label="Accent" icon="star" variant="accent" />
        <UiButton label="Danger" icon="trash" variant="danger" />
      </div>
    </section>

    <section>
      <h2>Types — Label (XS / sm)</h2>
      <div class="row">
        <UiButton label="Primary" icon="send" variant="primary" size="sm" />
        <UiButton label="Secondary" icon="settings" variant="secondary" size="sm" />
        <UiButton label="Tertiary" icon="plus" variant="tertiary" size="sm" />
        <UiButton label="Text" icon="edit" variant="text" size="sm" />
        <UiButton label="AI" icon="sparkles" variant="ai" size="sm" />
        <UiButton label="Accent" icon="star" variant="accent" size="sm" />
        <UiButton label="Danger" icon="trash" variant="danger" size="sm" />
      </div>
    </section>

    <section>
      <h2>Style Icon-only (Default)</h2>
      <div class="row">
        <UiButton icon="send" variant="primary" />
        <UiButton icon="settings" variant="secondary" />
        <UiButton icon="plus" variant="tertiary" />
        <UiButton icon="edit" variant="text" />
        <UiButton icon="sparkles" variant="ai" />
        <UiButton icon="star" variant="accent" />
        <UiButton icon="trash" variant="danger" />
      </div>
    </section>

    <section>
      <h2>Style Icon-only (XS / sm)</h2>
      <div class="row">
        <UiButton icon="send" variant="primary" size="sm" />
        <UiButton icon="settings" variant="secondary" size="sm" />
        <UiButton icon="plus" variant="tertiary" size="sm" />
        <UiButton icon="edit" variant="text" size="sm" />
        <UiButton icon="sparkles" variant="ai" size="sm" />
        <UiButton icon="star" variant="accent" size="sm" />
        <UiButton icon="trash" variant="danger" size="sm" />
      </div>
    </section>

    <section>
      <h2>États</h2>
      <div class="row">
        <UiButton label="Default" icon="check" />
        <UiButton label="Disabled" icon="check" disabled />
        <UiButton label="Loading" icon="check" loading />
        <UiButton label="Danger Disabled" icon="trash" variant="danger" disabled />
      </div>
    </section>

    <section>
      <h2>Icônes diverses</h2>
      <div class="row">
        <UiButton label="Mail" icon="mail" />
        <UiButton label="Search" icon="search" />
        <UiButton label="Download" icon="download" />
        <UiButton label="Arrow Left" icon="arrow-left" />
        <UiButton label="Star" icon="star" variant="accent" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIDIVIDER             -->
    <!-- ===================== -->
    <section>
      <h2>UiDivider</h2>
      <div class="column" style="width: 100%">
        <span class="input-demo__label">Default</span>
        <UiDivider />
        <span class="input-demo__label">Compact</span>
        <UiDivider size="compact" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISEARCHBAR           -->
    <!-- ===================== -->
    <section>
      <h2>UiSearchBar</h2>
      <div class="grid-inputs">
        <div class="input-demo">
          <span class="input-demo__label">Default</span>
          <UiSearchBar v-model="searchBarValue" placeholder="Rechercher un bien..." />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS</span>
          <UiSearchBar v-model="searchBarXsValue" placeholder="Rechercher..." size="xs" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Error</span>
          <UiSearchBar placeholder="Rechercher..." :error="true" hint-text="Aucun résultat" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiSearchBar placeholder="Non disponible" :disabled="true" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISLIDER              -->
    <!-- ===================== -->
    <section>
      <h2>UiSlider</h2>
      <div class="grid-inputs">
        <div class="input-demo">
          <span class="input-demo__label">Default</span>
          <UiSlider v-model="sliderValue" label="Surface" suffix=" m²" :max="200" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Minimal</span>
          <UiSlider v-model="sliderMinimalValue" label="Budget" suffix=" k€" style="minimal" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiSlider :model-value="30" label="Verrouillé" :disabled="true" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIPROGRESSBAR         -->
    <!-- ===================== -->
    <section>
      <h2>UiProgressBar</h2>
      <div class="column" style="gap: 16px; width: 100%">
        <div class="input-demo">
          <span class="input-demo__label">Partiel ({{ progressValue }}%)</span>
          <UiProgressBar :value="progressValue" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Complet (100%)</span>
          <UiProgressBar :value="100" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Début (15%)</span>
          <UiProgressBar :value="15" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UITOAST               -->
    <!-- ===================== -->
    <section>
      <h2>UiToast</h2>
      <div class="row">
        <UiButton label="Toast Notification" icon="info-circle" @click="showToastNotif = true" />
        <UiButton label="Toast Danger" icon="alert-triangle" variant="error" @click="showToastDanger = true" />
      </div>
      <div style="margin-top: 16px">
        <UiToast v-model="showToastNotif" message="Action effectuée avec succès" type="notification" :duration="0" />
        <UiToast v-model="showToastDanger" message="Une erreur est survenue" type="danger" :duration="0" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIATTRIBUTE           -->
    <!-- ===================== -->
    <section>
      <h2>UiAttribute</h2>
      <div class="row">
        <UiAttribute label="75 m²" icon="ruler-2" />
        <UiAttribute label="3 pièces" icon="door" />
        <UiAttribute label="2ème étage" icon="stairs-up" />
        <UiAttribute label="Balcon" icon="fence" />
      </div>
      <div class="row" style="margin-top: 16px">
        <div class="input-demo">
          <span class="input-demo__label">XS</span>
          <div class="row">
            <UiAttribute label="75 m²" icon="ruler-2" size="xs" />
            <UiAttribute label="3 pièces" icon="door" size="xs" />
          </div>
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Disabled</span>
          <UiAttribute label="Non dispo" icon="x" :disabled="true" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Sans icône</span>
          <UiAttribute label="DPE : A" :has-icon="false" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIPAGINATION          -->
    <!-- ===================== -->
    <section>
      <h2>UiPagination</h2>
      <div class="column" style="gap: 16px">
        <div class="input-demo">
          <span class="input-demo__label">Default (page {{ paginationPage }})</span>
          <UiPagination v-model="paginationPage" :total-pages="12" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">XS</span>
          <UiPagination :model-value="5" :total-pages="20" size="xs" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISTEPPER             -->
    <!-- ===================== -->
    <section class="section--wide">
      <h2>UiStepper</h2>
      <div class="column" style="gap: 32px; width: 100%">
        <div class="input-demo">
          <span class="input-demo__label">Step 2 actif (Default)</span>
          <UiStepper :steps="stepperSteps" :active-step="1" />
        </div>
        <div class="input-demo">
          <span class="input-demo__label">Step 3 actif (XS)</span>
          <UiStepper :steps="stepperSteps" :active-step="2" size="xs" />
        </div>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UICARD                -->
    <!-- ===================== -->
    <section>
      <h2>UiCard</h2>
      <div class="row" style="align-items: stretch">
        <UiCard title="Appartement T3" subtitle="Paris 15ème" style="width: 300px">
          <p style="margin: 0; color: var(--text-body-secondary)">Bel appartement lumineux avec balcon et vue dégagée.</p>
          <template #footer>
            <UiButton label="Voir" size="sm" variant="ghost" icon="eye" />
            <UiButton label="Modifier" size="sm" variant="secondary" icon="pencil" />
          </template>
        </UiCard>

        <UiCard type="media-top" title="Villa Côte d'Azur" subtitle="950 000 €" style="width: 300px">
          <template #media>
            <div style="height: 160px; background: linear-gradient(135deg, var(--alias-primary-100), var(--alias-primary-300))"></div>
          </template>
          <p style="margin: 0; color: var(--text-body-secondary)">Superbe villa avec piscine et jardin.</p>
          <template #footer>
            <UiPill label="En vente" color="green" icon="circle-check" size="xs" />
          </template>
        </UiCard>

        <UiCard type="minimal" style="width: 300px">
          <div style="text-align: center; padding: 16px 0">
            <p style="margin: 0 0 8px; font-weight: 600; color: var(--text-headings)">Ajouter un bien</p>
            <p style="margin: 0; color: var(--text-body-secondary); font-size: 12px">Cliquez pour créer une nouvelle annonce</p>
          </div>
        </UiCard>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISECTIONTITLE        -->
    <!-- ===================== -->
    <section>
      <h2>UiSectionTitle</h2>
      <div class="column" style="gap: 24px; width: 100%">
        <UiSectionTitle title="Section H1" type="h1" has-icon icon="layout-dashboard" />
        <UiSectionTitle title="Section H2" type="h2" />
        <UiSectionTitle title="Section avec description" type="h2" description="Description détaillée de la section" style="with-description" has-icon icon="info-circle" />
        <UiSectionTitle title="Section H3 XS" type="h3" size="xs" />
      </div>
    </section>

    <!-- ===================== -->
    <!-- UISECTION             -->
    <!-- ===================== -->
    <section>
      <h2>UiSection</h2>
      <div style="border: 1px solid var(--border-default); border-radius: var(--radius-xl); overflow: hidden">
        <UiSection title="Informations générales" description="Détails du bien immobilier" heading-type="h2" has-icon icon="info-circle">
          <p style="margin: 0; color: var(--text-body)">Contenu de la section avec les informations du bien.</p>
        </UiSection>
      </div>
    </section>

    <!-- ===================== -->
    <!-- UIMODAL               -->
    <!-- ===================== -->
    <section>
      <h2>UiModal</h2>
      <div class="row">
        <UiButton label="Modal Default" icon="layout-grid" @click="showModal = true" />
        <UiButton label="Modal Danger" icon="trash" variant="error" @click="showModalDanger = true" />
      </div>
      <UiModal v-model="showModal" title="Confirmer la publication" description="Le bien sera visible par tous les utilisateurs. Êtes-vous sûr de vouloir publier ?" icon="info-circle" />
      <UiModal v-model="showModalDanger" title="Supprimer le bien ?" description="Cette action est irréversible. Toutes les données seront perdues." type="danger" icon="alert-triangle" confirm-label="Supprimer" />
    </section>

    <!-- ===================== -->
    <!-- UIDRAWER              -->
    <!-- ===================== -->
    <section>
      <h2>UiDrawer</h2>
      <UiButton label="Ouvrir le Drawer" icon="layout-sidebar-right" @click="showDrawer = true" />
      <UiDrawer v-model="showDrawer" title="Détails du bien" icon="building" :has-footer="true">
        <UiSection title="Informations" heading-type="h3" no-padding>
          <p style="margin: 0; color: var(--text-body)">Contenu détaillé du bien immobilier avec toutes les informations nécessaires.</p>
        </UiSection>
        <template #footer>
          <UiButton label="Annuler" variant="secondary" size="sm" @click="showDrawer = false" />
          <UiButton label="Enregistrer" size="sm" @click="showDrawer = false" />
        </template>
      </UiDrawer>
    </section>

    <!-- ===================== -->
    <!-- UIPAGEHEADER          -->
    <!-- ===================== -->
    <section class="section--wide" style="padding: 0; overflow: hidden">
      <UiPageHeader title="Liste des biens" has-back @back="() => {}">
        <template #tabs>
          <UiTab v-model="selectedTab" :tabs="simpleTabs" />
        </template>
        <template #actions>
          <UiButton label="Exporter" icon="download" variant="secondary" size="sm" />
          <UiButton label="Ajouter" icon="plus" size="sm" />
        </template>
      </UiPageHeader>
    </section>

    <!-- ===================== -->
    <!-- UIAISEARCHPROMPT      -->
    <!-- ===================== -->
    <section>
      <h2>UiAiSearchPrompt</h2>

      <div class="input-demo__label" style="margin-bottom: 16px;">
        Trigger de recherche & prompt IA — s'utilise dans la TopBar ou en Dashboard
      </div>

      <div class="column">
        <div class="input-demo__label">Topbar — Default</div>
        <UiAiSearchPrompt type="Topbar" @click="() => {}" />

        <div class="input-demo__label" style="margin-top: 8px;">Dashboard — Default</div>
        <UiAiSearchPrompt type="Dashboard" @click="() => {}" />
      </div>
    </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TokensPage from "./TokensPage.vue";

const activeTab = ref<"components" | "tokens">("components");
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
import UiMenuOffice from "../src/components/UiMenuOffice.vue";
import UiTopbarOffice from "../src/components/UiTopbarOffice.vue";
import UiToggle from "../src/components/UiToggle.vue";
import UiSelect from "../src/components/UiSelect.vue";
import UiPopup from "../src/components/UiPopup.vue";
import UiPopupIcon from "../src/components/UiPopupIcon.vue";
import UiDynamicInput from "../src/components/UiDynamicInput.vue";
import UiFilter from "../src/components/UiFilter.vue";
import UiContainersHeader from "../src/components/UiContainersHeader.vue";
import UiAccordion from "../src/components/UiAccordion.vue";
import UiDropdown from "../src/components/UiDropdown.vue";
import type { DropdownItem } from "../src/components/UiDropdown.vue";
import UiSearchBar from "../src/components/UiSearchBar.vue";
import UiSlider from "../src/components/UiSlider.vue";
import UiProgressBar from "../src/components/UiProgressBar.vue";
import UiToast from "../src/components/UiToast.vue";
import UiAttribute from "../src/components/UiAttribute.vue";
import UiDivider from "../src/components/UiDivider.vue";
import UiPagination from "../src/components/UiPagination.vue";
import UiStepper from "../src/components/UiStepper.vue";
import UiCard from "../src/components/UiCard.vue";
import UiModal from "../src/components/UiModal.vue";
import UiSectionTitle from "../src/components/UiSectionTitle.vue";
import UiSection from "../src/components/UiSection.vue";
import UiDrawer from "../src/components/UiDrawer.vue";
import UiPageHeader from "../src/components/UiPageHeader.vue";
import UiAiSearchPrompt from "../src/components/UiAiSearchPrompt.vue";

// Dynamic Input demos
const dynamicEmpty = ref<string[]>([]);
const dynamicFilled = ref<string[]>(["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]);
const dynamicError = ref<string[]>([]);
const dynamicErrorFilled = ref<string[]>(["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]);
const dynamicDisabled = ref<string[]>(["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"]);

// Popup demos
const showPopupPositive = ref(false);
const showPopupNegative = ref(false);
const showPopupWarning = ref(false);
const showPopupNeutral = ref(false);

function handlePopupConfirm() {
  console.log("Popup confirmed");
}

function handlePopupCancel() {
  console.log("Popup cancelled");
}

function handlePopupDelete() {
  console.log("Delete confirmed");
}

// Select demos
const selectEmpty = ref<string | null>(null);
const selectFilled = ref<string | null>("apartment");
const selectError = ref<string | null>(null);
const selectErrorFilled = ref<string | null>("paris");
const selectHint = ref<string | null>(null);
const selectSimple = ref<string | null>(null);
const selectWithDisabled = ref<string | null>(null);

const propertyTypes = [
  { label: "Appartement", value: "apartment" },
  { label: "Maison", value: "house" },
  { label: "Studio", value: "studio" },
  { label: "Loft", value: "loft" },
  { label: "Villa", value: "villa" },
];

const cities = [
  { label: "Paris", value: "paris" },
  { label: "Lyon", value: "lyon" },
  { label: "Marseille", value: "marseille" },
  { label: "Bordeaux", value: "bordeaux" },
  { label: "Nice", value: "nice" },
];

const roomOptions = [
  { label: "1 pièce", value: 1 },
  { label: "2 pièces", value: 2 },
  { label: "3 pièces", value: 3 },
  { label: "4 pièces", value: 4 },
  { label: "5+ pièces", value: 5 },
];

const statusOptions = [
  { label: "Tous", value: "all" },
  { label: "En cours", value: "pending" },
  { label: "Validé", value: "validated" },
  { label: "Archivé", value: "archived" },
];

const planOptions = [
  { label: "Gratuit", value: "free" },
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
  { label: "Enterprise", value: "enterprise", disabled: true },
];

// Textarea demos
const textareaEmpty = ref("");
const textareaFilled = ref(
  "Ceci est un exemple de texte rempli dans le textarea. Il peut contenir plusieurs lignes de contenu."
);
const textareaError = ref("");

// Radio demos
const radioValue1 = ref("maison");
const radioValue2 = ref("email");
const radioValue3 = ref("mois");

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
const checkboxIcon1 = ref(false);
const checkboxIcon2 = ref(true);
const checkboxIcon3 = ref(false);

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
const demoSnackbarStatus = ref<"default" | "success" | "error" | "warning">(
  "default"
);
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
    pillColor: "statusColor",
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
      { name: "delete", icon: "trash", variant: "error" },
    ],
  },
];

const tableRows = [
  {
    reference: "BN-001",
    type: "Appartement T3",
    city: "Paris",
    price: "450 000 €",
    surface: "75 m²",
    status: "En cours",
    statusIcon: "refresh",
    statusColor: "blue",
  },
  {
    reference: "BN-002",
    type: "Maison",
    city: "Lyon",
    price: "680 000 €",
    surface: "120 m²",
    status: "Validé",
    statusIcon: "circle-check",
    statusColor: "green",
  },
  {
    reference: "BN-003",
    type: "Studio",
    city: "Marseille",
    price: "180 000 €",
    surface: "25 m²",
    status: "En attente",
    statusIcon: "alert-circle",
    statusColor: "orange",
  },
  {
    reference: "BN-004",
    type: "Appartement T2",
    city: "Bordeaux",
    price: "320 000 €",
    surface: "55 m²",
    status: "Annulé",
    statusIcon: "x",
    statusColor: "red",
  },
  {
    reference: "BN-005",
    type: "Villa",
    city: "Nice",
    price: "950 000 €",
    surface: "180 m²",
    status: "Exporté",
    statusIcon: "arrow-up-right",
    statusColor: "purple",
  },
  {
    reference: "BN-006",
    type: "Loft",
    city: "Lille",
    price: "420 000 €",
    surface: "90 m²",
    status: "Archivé",
    statusIcon: "archive",
    statusColor: "grey",
  },
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

function handleCellAction(payload: {
  action: string;
  row: Record<string, unknown>;
  rowIndex: number;
}) {
  console.log("Cell action:", payload);
}

// Toggle demos
const selectedToggle = ref("email");
const toggleOptions = [
  { label: "Email", value: "email", icon: "mail" },
  { label: "SMS", value: "sms", icon: "message" },
];

const selectedToggleText = ref("jour");
const toggleOptionsText = [
  { label: "Jour", value: "jour" },
  { label: "Semaine", value: "semaine" },
  { label: "Mois", value: "mois" },
];

const selectedToggleDisabled = ref("actif");
const toggleOptionsDisabled = [
  { label: "Actif", value: "actif", icon: "check" },
  { label: "Inactif", value: "inactif", icon: "x" },
  { label: "Archivé", value: "archive", icon: "archive", disabled: true },
];

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
const selectedTabXs = ref("all");
const selectedTabXsIcon = ref("dashboard");
const selectedTabDark = ref("all");
const selectedTabDarkWithIcon = ref("dashboard");
const containerTabDefault = ref("all");
const containerTabXs = ref("all");
const tabsWithDisabled = [
  { label: "Actifs", value: "active" },
  { label: "Archivés", value: "archived" },
  { label: "Brouillons", value: "drafts", disabled: true },
];

// Menu Office demos
const selectedMenuItem = ref("properties");
const menuCollapsed = ref(false);
const menuItems = [
  { label: "Dashboard", value: "dashboard", icon: "tabler:layout-dashboard" },
  {
    label: "Biens",
    value: "properties",
    icon: "tabler:building",
    children: [
      { label: "Tous les biens", value: "properties-all", icon: "tabler:list" },
      {
        label: "Appartements",
        value: "properties-apartments",
        icon: "tabler:building-skyscraper",
      },
      { label: "Maisons", value: "properties-houses", icon: "tabler:home" },
      { label: "Terrains", value: "properties-lands", icon: "tabler:map" },
    ],
  },
  { label: "Contacts", value: "contacts", icon: "tabler:users", badge: 12 },
  {
    label: "Rapports",
    value: "reports",
    icon: "tabler:chart-bar",
    children: [
      {
        label: "Ventes",
        value: "reports-sales",
        icon: "tabler:trending-up",
        badge: 3,
      },
      { label: "Locations", value: "reports-rentals", icon: "tabler:key" },
      {
        label: "Statistiques",
        value: "reports-stats",
        icon: "tabler:chart-pie",
      },
    ],
  },
  { label: "Documents", value: "documents", icon: "tabler:files" },
  { label: "Paramètres", value: "settings", icon: "tabler:settings" },
];

const currentUser = {
  name: "Pierre Martin",
  role: "Administrateur",
};

function handleUserAction(action: "profile" | "logout") {
  console.log("User action:", action);
  if (action === "logout") {
    alert("Déconnexion...");
  } else if (action === "profile") {
    alert("Ouvrir la page de profil...");
  }
}

// TopbarOffice data
const demoBreadcrumb = [
  { label: "Modelo Infinite", value: "home" },
  { label: "Rapports", value: "reports" },
  { label: "Ventes", value: "sales" },
];

function handleBreadcrumbNavigate(
  item: { label: string; value?: string },
  index: number
) {
  console.log("Navigate to:", item, "at index:", index);
  alert(`Navigation vers : ${item.label}`);
}

function handleNotificationClick() {
  console.log("Notification clicked");
  alert("Ouverture des notifications...");
}

// Accordion demos
const accordion1 = ref(true);
const accordion2 = ref(false);

// Dropdown demos
const dropdownSelected = ref<(string | number)[]>([]);
const dropdownItems: DropdownItem[] = [
  { label: "Actions", type: "title1" },
  { label: "Modifier", value: "edit", icon: "pencil" },
  { label: "Dupliquer", value: "duplicate", icon: "copy" },
  { label: "Partager", value: "share", icon: "share" },
  { label: "", type: "separator" },
  { label: "Avancé", type: "title2" },
  { label: "Variable dynamique", value: "dynamic", type: "dynamic", icon: "code" },
  { label: "Archiver", value: "archive", icon: "archive", disabled: true },
  { label: "", type: "separator" },
  { label: "Supprimer", value: "delete", icon: "trash" },
];

const dropdownCheckboxItems: DropdownItem[] = [
  { label: "Colonnes visibles", type: "title1" },
  { label: "Référence", value: "ref", type: "checkbox", selected: true },
  { label: "Type de bien", value: "type", type: "checkbox", selected: true },
  { label: "Ville", value: "city", type: "checkbox", selected: true },
  { label: "Prix", value: "price", type: "checkbox", selected: false },
  { label: "Surface", value: "surface", type: "checkbox", selected: false },
];
const dropdownCheckboxSelected = ref<(string | number)[]>(["ref", "type", "city"]);

function handleDropdownSelect(item: DropdownItem) {
  console.log("Dropdown selected:", item);
}

// New components demos
const searchBarValue = ref("");
const searchBarXsValue = ref("");
const sliderValue = ref(40);
const sliderMinimalValue = ref(65);
const progressValue = ref(65);
const showToastNotif = ref(false);
const showToastDanger = ref(false);
const paginationPage = ref(3);
const showModal = ref(false);
const showModalDanger = ref(false);
const showDrawer = ref(false);

const stepperSteps = [
  { label: "Informations", description: "Détails du bien" },
  { label: "Photos", description: "Ajouter des médias" },
  { label: "Tarification", description: "Prix et conditions" },
  { label: "Publication", description: "Mise en ligne" },
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

.playground-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 32px;
  background: white;
  padding: 4px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.playground-tabs__btn {
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #96a4c1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.playground-tabs__btn:hover {
  color: #303441;
  background: #f5f7f9;
}

.playground-tabs__btn--active {
  background: #3d64ed;
  color: white;
}

.playground-tabs__btn--active:hover {
  background: #3456d0;
  color: white;
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

.menu-demo-container {
  display: flex;
  flex-direction: column;
}

.menu-demo-wrapper {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: visible;
  height: 400px;
}

.topbar-demo-container {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

.hint {
  font-size: 12px;
  color: #96a4c1;
}
</style>

<!-- Style global pour les tooltips Quasar (non scopé) -->
<style>
/* Tooltip global styling - fond noir */
.q-tooltip {
  font-family: var(--font-family-body, "Inter", system-ui, sans-serif);
  font-size: 12px;
  background-color: var(--alias-neutral-900, #1f2937) !important;
  color: var(--alias-neutral-white, #ffffff) !important;
  padding: 6px 10px;
  border-radius: var(--alias-border-radius-sm, 4px);
}
</style>
