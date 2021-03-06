/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import '@clr/core/icon';

import { coreCollectionAliases, coreCollectionIcons, loadCoreIconSet } from '@clr/core/icon';

const iconSets = [
  {
    name: 'Core',
    loader: loadCoreIconSet,
    iconList: coreCollectionIcons,
    aliasList: coreCollectionAliases,
  },
];

const iconSetIndex = loadAndIndexIconSets(iconSets);

@Component({
  selector: 'app-icon-sets-demo',
  templateUrl: './icon-sets.demo.html',
})
export class IconSetsDemoComponent {
  iconIndex: {
    Core?: string[];
  } = {};

  iconFilterAndToggles = this.fb.group({
    currentSet: ['All'],
    isSolid: [false],
    isInverse: [false],
    decoration: ['none'],
    filterText: [''],
  });

  constructor(private fb: FormBuilder) {
    this.iconIndex = iconSetIndex;
  }

  showIcon(name: string): boolean {
    const currentFilterText = this.iconFilterAndToggles.get('filterText').value;
    return currentFilterText === '' || name.indexOf(currentFilterText) > -1;
  }

  get availableSets() {
    return iconSets.map(s => s.name);
  }

  get visibleIconSets() {
    const currentSet = this.iconFilterAndToggles.get('currentSet').value;
    return currentSet === 'All' ? this.availableSets : [currentSet];
  }

  get iconClassnames() {
    const filterFormGroup = this.iconFilterAndToggles;
    const isSolid = filterFormGroup.get('isSolid').value;
    const isInverse = filterFormGroup.get('isInverse').value;
    const decoration = filterFormGroup.get('decoration').value;

    const classnameTests = [
      ['is-solid', isSolid],
      ['is-inverse', isInverse],
      ['has-alert', decoration === 'alerted'],
      ['has-badge', decoration === 'badged'],
    ];

    return classnameTests.map(item => (item[1] ? item[0] : '')).join(' ');
  }

  get iconRowClassnames() {
    const defaultClassnames = 'clr-row dc-icon-boxes ';
    return this.iconFilterAndToggles.get('isInverse').value ? defaultClassnames + 'inverse' : defaultClassnames;
  }
}

function loadAndIndexIconSets(iconSetArray) {
  const iconIndex = {};
  iconSetArray.forEach(iconSet => {
    const index = createIconIndices(iconSet.iconList, iconSet.aliasList);
    iconSet.loader();
    Object.defineProperty(iconIndex, iconSet.name, {
      value: index,
      enumerable: true,
    });
  });
  return iconIndex;
}

function createIconIndices(icons: [string, string][], aliases: [string, string[]][]): string[] {
  const iconsMap = icons.map(iconTuple => iconTuple[0]);
  const aliasMap = aliases.map(aliasTuple => aliasTuple[1]).reduce((acc, val) => acc.concat(val), []);
  const returnAry = iconsMap.concat(aliasMap).sort();
  return returnAry;
}

// TODO:
// - update styles to use our base-20rem...
